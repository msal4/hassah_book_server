import { Repository, BaseEntity, DeepPartial, getRepository, SelectQueryBuilder } from "typeorm";
import { ClassType } from "type-graphql";

import { PaginatedResponse } from "@api/modules/types/PaginatedResponse";
import { hasMore } from "@api/modules/utils/hasMore";
import { FindManyToManyOptions } from "@api/modules/services/base/FindManyToManyOptions";
import { orderByToMap } from "@api/modules/utils/orderByToMap";
import { lowerCamelCase, tsQuery } from "@api/modules/utils/string";
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
    } else {
      throw new Error("Service name should be the name of the entity with the suffix 'Service'");
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

    return { items, total, hasMore: filterArgs ? hasMore(filterArgs, total) : false };
  }

  async findAll(options: FindAllOptions): Promise<PaginatedResponse<T>> {
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

  create(data: DeepPartial<T>): Promise<T> {
    return this.repository.create(data).save();
  }

  async update(data: DeepPartial<T> & { id: string }): Promise<boolean> {
    try {
      const item = await this.repository.findOne({ where: { id: data.id } });
      this.repository.merge(item!, data);
      await item!.save();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.repository.delete(id);
      // It'll return true even if there are no rows affected.
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
