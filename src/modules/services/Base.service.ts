import { Repository, BaseEntity, DeepPartial, getRepository, SelectQueryBuilder } from "typeorm";
import { ClassType } from "type-graphql";
import { FileUpload } from "graphql-upload";
import { S3 } from "aws-sdk";

import { PaginatedResponse } from "@api/modules/types/PaginatedResponse";
import { hasMore } from "@api/modules/utils/hasMore";
import { FindManyToManyOptions } from "@api/modules/services/base/FindManyToManyOptions";
import { orderByToMap } from "@api/modules/utils/orderByToMap";
import { formatFileName, lowerCamelCase, tsQuery } from "@api/modules/utils/string";
import { FindAllOptions } from "@api/modules/types/FindAllOptions";

// The default service on which other services are based on.
export class BaseService<T extends BaseEntity> {
  constructor() {
    const className = this.constructor.name;
    if (className.endsWith("Service")) {
      this.entityName = className.substr(0, className.indexOf("Service"));
      this.tableName = lowerCamelCase(this.entityName);
      this.repository = getRepository(this.entityName);
      this.hasDocument = !!this.repository.metadata.columns.find(
        (column) => column.propertyName === "document"
      );
      this.hasImage = !!this.repository.metadata.columns.find(
        (column) => column.propertyName === this.imageColumnName
      );
    } else {
      throw new Error("Service name should be the entity name with the suffix 'Service'");
    }
  }

  public readonly repository: Repository<T>;
  // The default relation ids to be retrieved with the entities.
  public relations: string[] = [];
  // The entity name that is retrieved from the class name.
  protected readonly entityName: string;
  // The camel case table name that is derived from `entityName`.
  protected readonly tableName: string;
  // Determines if the table has a document column used for full-text search.
  protected readonly hasDocument: boolean = false;
  // Determines if the table has an image column.
  protected readonly hasImage: boolean = false;
  // The image column name.
  protected readonly imageColumnName: string = "image";
  // The s3 instance.
  protected readonly s3 = new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
    apiVersion: "2006-03-01",
  });
  // The name of the s3 bucket where uploaded files are stored.
  protected readonly bucket = process.env.AWS_S3_BUCKET!;

  static async findManyToMany<R>(
    Entity: ClassType<R>,
    { childId, relationName, relations = [], filterArgs }: FindManyToManyOptions
  ) {
    const repository = getRepository(Entity);
    const tableName = lowerCamelCase(Entity.name);

    // Since typeorm does not handle pagination for relations I wrote the query myself.
    // It should be resolved soon but for now this will do the trick.
    // issues: https://github.com/typeorm/typeorm/issues/5392, https://github.com/typeorm/typeorm/issues/3251
    const [items, total] = await repository
      .createQueryBuilder(tableName)
      .innerJoin(`${tableName}.${relationName}`, `${tableName}Item`, `${tableName}Item.id = :childId`, {
        childId,
      })
      .orderBy(orderByToMap(filterArgs?.order, tableName, ".") ?? {})
      .loadAllRelationIds({ relations })
      .skip(filterArgs?.skip)
      .take(filterArgs?.take)
      .getManyAndCount();

    return { items, total, hasMore: hasMore(filterArgs ?? { skip: 0, take: items.length }, total) };
  }

  public async findOne(id: string): Promise<T | null> {
    const item = await this.repository.findOne(id, { loadRelationIds: true, relations: this.relations });
    return item ?? null;
  }

  public async findAll(options: FindAllOptions): Promise<PaginatedResponse<T>> {
    let query = this.repository
      .createQueryBuilder(this.tableName)
      .select()
      .loadAllRelationIds({ relations: this.relations });

    if (options.where) {
      query = query.where(options.where);
    }

    query = this.applyOrderBy(query, options);

    query = this.applySearchQuery(query, options);

    const [items, total] = await query.skip(options.skip).take(options.take).getManyAndCount();

    return { items, total, hasMore: hasMore(options, total) };
  }

  private applyOrderBy(query: SelectQueryBuilder<T>, options: FindAllOptions): SelectQueryBuilder<T> {
    if (!options.order) {
      return query;
    }

    for (const ob of options.order) {
      query = query.addOrderBy(`${this.tableName}.${ob.field}`, ob.order);
    }
    return query;
  }

  private applySearchQuery(query: SelectQueryBuilder<T>, options: FindAllOptions): SelectQueryBuilder<T> {
    if (!options.searchQuery) {
      return query;
    }

    // Fallback to good old 'LIKE' if the document column does not exist.
    if (!this.hasDocument) {
      return query.andWhere(`${this.tableName}::TEXT like '%' || :query || '%'`, {
        query: options.searchQuery,
      });
    }

    // Use full-text search.
    return query
      .andWhere(`${this.tableName}.document @@ to_tsquery(:query)`, {
        query: tsQuery(options.searchQuery),
      })
      .addOrderBy(`ts_rank(${this.tableName}.document, to_tsquery(:query))`, "DESC");
  }

  public async create(
    data: DeepPartial<T>,
    imageFile?: FileUpload,
    imageColumnName = this.imageColumnName
  ): Promise<T> {
    if (!imageFile || !this.hasImage) {
      return this.repository.save(data);
    }

    const res = await this.uploadImage(imageFile);
    return this.repository.save({ ...data, [imageColumnName]: res.Key });
  }

  public async update(
    data: DeepPartial<T> & { id: string },
    imageFile?: FileUpload,
    imageColumnName = this.imageColumnName
  ): Promise<boolean> {
    try {
      if (!imageFile || !this.hasImage) {
        await this.repository.save(data);
        return true;
      }

      const item = await this.repository.findOne({ where: { id: data.id } });
      const res = await this.uploadImage(imageFile, item && (item as any)[imageColumnName]);
      await this.repository.save({ ...data, [imageColumnName]: res.Key });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async delete(id: string, imageColumnName = this.imageColumnName): Promise<boolean> {
    try {
      const item = await this.repository.findOne({ where: { id } });
      if (!item) {
        return true;
      }

      if (this.hasImage) {
        await this.s3.deleteObject({ Bucket: this.bucket, Key: (item as any)[imageColumnName] }).promise();
      }

      await item.remove();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  protected uploadImage({ createReadStream, mimetype, filename }: FileUpload, currentImagePath?: string) {
    const newImagePath = `${this.tableName.toLowerCase()}/${formatFileName(filename)}`;

    return this.s3
      .upload({
        Bucket: this.bucket,
        Key: currentImagePath ?? newImagePath,
        Body: createReadStream(),
        ContentType: mimetype,
        ACL: "public-read",
      })
      .promise();
  }
}
