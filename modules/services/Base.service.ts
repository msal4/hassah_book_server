import {
  Repository,
  BaseEntity,
  DeepPartial,
  getRepository,
  SelectQueryBuilder,
  FindOneOptions,
  FindManyOptions,
} from "typeorm";
import { ClassType } from "type-graphql";
import { FileUpload } from "graphql-upload";
import mime from "mime-types";
import { Client as MinioClient } from "minio";

import { PaginatedResponse } from "@api/modules/types/PaginatedResponse";
import { hasMore } from "@api/modules/utils/hasMore";
import { FindManyToManyOptions } from "@api/modules/services/base/FindManyToManyOptions";
import { orderByToMap } from "@api/modules/utils/orderByToMap";
import { formatFileName, lowerCamelCase, tsQuery } from "@api/modules/utils/string";
import { FindAllOptions } from "@api/modules/types/FindAllOptions";

const minioURL = process.env.MINIO_HOST!.split(":");
const minioHost = minioURL[0],
  minioPort = minioURL[1];

// The default service on which other services are based on.
export class BaseService<T extends BaseEntity> {
  constructor() {
    const className = this.constructor.name;
    if (!className.endsWith("Service")) {
      throw new Error("Service name should be the entity name with the suffix 'Service'");
    }

    this.entityName = className.substring(0, className.indexOf("Service"));
    this.tableName = lowerCamelCase(this.entityName);
    this.repository = getRepository(this.entityName);
    this.hasDocument = !!this.repository.metadata.columns.find(
      (column) => column.propertyName === "document"
    );
    this.hasImage = !!this.repository.metadata.columns.find(
      (column) => column.propertyName === this.imageColumnName
    );
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
  // The s3 compatible client.
  protected readonly minio = new MinioClient({
    endPoint: minioHost,
    port: minioPort ? Number(minioPort) : undefined,
    accessKey: process.env.MINIO_ACCESS_KEY_ID!,
    secretKey: process.env.MINIO_SECRET_KEY!,
    useSSL: process.env.MINIO_USE_SSL === "true",
  });
  // The name of the bucket in which uploaded files are stored.
  protected readonly bucket = process.env.MINIO_BUCKET!;

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
      .andWhere(`${tableName}::TEXT ILIKE '%' || :query || '%'`, {
        query: filterArgs?.searchQuery ?? "",
      })
      .skip(filterArgs?.skip)
      .take(filterArgs?.take)
      .getManyAndCount();

    return { items, total, hasMore: hasMore(filterArgs ?? { skip: 0, take: items.length }, total) };
  }

  public async findOne(options: FindOneOptions<T>): Promise<T | null> {
    const item = await this.repository.findOne({
      loadRelationIds: true,
      relations: this.relations,
      ...options,
    });
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
      return query.andWhere(`${this.tableName}::TEXT ILIKE '%' || :query || '%'`, {
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

  public findByIds(ids: string[], options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.findByIds(ids, {
      ...(options ?? {}),
      loadRelationIds: true,
      relations: this.relations,
    });
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
    return this.repository.save({ ...data, [imageColumnName]: res });
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
      await this.repository.save({ ...data, [imageColumnName]: res });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async delete(id: string, relations?: string[]): Promise<boolean> {
    try {
      const item = await this.repository.findOne({ where: { id }, relations });
      if (!item) {
        return true;
      }

      // DON'T NEED TO REMOVE IMAGE
      //if (this.hasImage) {
      //  await this.s3.deleteObject({ Bucket: this.bucket, Key: (item as any)[imageColumnName] }).promise();
      //}

      await item.softRemove();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  protected async uploadImage(
    { createReadStream, mimetype, filename }: FileUpload,
    currentImagePath?: string
  ) {
    const ext = mime.extension(mimetype);
    const imagePath =
      currentImagePath ?? `${this.tableName.toLowerCase()}/${formatFileName(filename, ext ? ext : null)}`;

    await this.minio.putObject(this.bucket, imagePath, createReadStream());

    return imagePath;
  }
}
