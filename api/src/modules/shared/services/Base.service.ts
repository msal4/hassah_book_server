import { FindManyOptions, Repository, BaseEntity, DeepPartial, getRepository } from "typeorm";
import { ClassType } from "type-graphql";

import { PaginatedResponse } from "@api/modules/shared/types/PaginatedResponse";
import { hasMore } from "@api/modules/utils/hasMore";
import { FindManyToManyOptions } from "@api/modules/shared/services/base/FindManyToManyOptions";
import { FilterArgs } from "@api/modules/shared/types/FilterArgs";
import { orderByToMap } from "@api/modules/utils/orderByToMap";

// The default service on which other services are based on.
export class BaseService<T extends BaseEntity> {
  constructor() {
    const className = this.constructor.name;
    if (className.endsWith("Service")) {
      this.entityName = className.substr(0, className.indexOf("Service"));
      this.repository = getRepository(this.entityName);
    } else {
      throw new Error("Service name should be the name of the entity with the suffix 'Service'");
    }
  }

  public readonly repository: Repository<T>;
  // The default relation ids to be retrieved with the entities.
  public relations: string[] = [];
  // The entity name that is retrieved from the class name.
  protected readonly entityName: string;

  static async findManyToMany<R>(
    Entity: ClassType<R>,
    { childId, relationName, relations = [], filterArgs }: FindManyToManyOptions
  ) {
    const repository = getRepository(Entity);
    const tableName = Entity.name.toLowerCase();

    // Since typeorm does not handle pagination for relations I have to write the query myself.
    // It should be resolved soon but for now this will do the trick.
    // issue: https://github.com/typeorm/typeorm/issues/5392
    const [items, total] = await repository
      .createQueryBuilder(tableName)
      .innerJoin(`${tableName}.${relationName}`, `${tableName}Item`, `${tableName}Item.id = :childId`, {
        childId,
      })
      .loadAllRelationIds({ relations })
      .skip(filterArgs?.skip)
      .take(filterArgs?.take)
      .getManyAndCount();

    return { items, total, hasMore: filterArgs ? hasMore(filterArgs, total) : false };
  }

  async findAll(options: FilterArgs & FindManyOptions<T>): Promise<PaginatedResponse<T>> {
    const [items, total] = await this.repository.findAndCount({
      ...options,
      order: orderByToMap<T>(options.order),
      loadRelationIds: { relations: this.relations },
    });
    return { items, total, hasMore: hasMore(options, total) };
  }

  create(data: DeepPartial<T>): Promise<T> {
    return this.repository.create(data).save();
  }

  async update(data: DeepPartial<T> & { id: string }): Promise<boolean> {
    try {
      const item = await this.repository.findOne({ where: { id: data.id } });
      this.repository.merge(item!, data);
      item!.save();
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
