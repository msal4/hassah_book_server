import { FindManyOptions, Repository, BaseEntity, DeepPartial } from "typeorm";

import { PaginatedResponse } from "@api/modules/shared/types/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { hasMore } from "@api/modules/utils/hasMore";

// The default service on which other services are based on.
export class BaseService<T extends BaseEntity> {
  constructor(public readonly repository: Repository<T>) {}

  // The default relations to be retrieved with the entities.
  protected relations = [];

  async findAll(options: PagniationArgs & FindManyOptions<T>): Promise<PaginatedResponse<T>> {
    const [items, total] = await this.repository.findAndCount({
      relations: this.relations,
      ...options,
      loadRelationIds: true,
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
