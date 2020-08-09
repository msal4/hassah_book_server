import { FindManyOptions, Repository, BaseEntity, DeepPartial, getRepository } from "typeorm";

import { PaginatedResponse } from "@api/modules/shared/types/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { hasMore } from "@api/modules/utils/hasMore";
import { FindManyToManyOptions } from "@api/modules/shared/services/base/FindManyToManyOptions";

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
  // The entity name that is retrieved from the class name.
  protected readonly entityName: string;
  // The default relation ids to be retrieved with the entities.
  protected relations: string[] = [];

  async findAll(options: PagniationArgs & FindManyOptions<T>): Promise<PaginatedResponse<T>> {
    const [items, total] = await this.repository.findAndCount({
      ...options,
      loadRelationIds: { relations: this.relations },
    });
    return { items, total, hasMore: hasMore(options, total) };
  }

  async findManyToMany<R>({ parentId, relationName, paginationArgs }: FindManyToManyOptions) {
    // Lower case the first character to get the table name.
    const tableName = this.entityName[0].toLocaleLowerCase() + this.entityName.substr(1);

    // Since typeorm does not handle pagination for relations I have to write the query myself.
    // It should be resolved soon but for now this will do the trick.
    // issue: https://github.com/typeorm/typeorm/issues/5392
    const parent = await this.repository
      .createQueryBuilder(tableName)
      .loadRelationCountAndMap(`${tableName}.totalItems`, `${tableName}.${relationName}`)
      .innerJoinAndSelect(`${tableName}.${relationName}`, `${tableName}Item`, `${tableName}.id = :parentId`, {
        parentId,
      })
      .offset(paginationArgs?.skip)
      .limit(paginationArgs?.take)
      .getOne();

    if (!parent) {
      return { items: [], total: 0, hasMore: false };
    }

    const total = (parent as any).totalItems as number;

    return {
      items: (parent as any)[relationName] as R[],
      total,
      hasMore: paginationArgs ? hasMore(paginationArgs, total) : false,
    };
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
