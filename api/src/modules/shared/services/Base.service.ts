import { FindManyOptions, Repository, BaseEntity, DeepPartial } from "typeorm";

import { PaginatedResponse } from "@api/modules/shared/types/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { hasMore } from "../../utils/hasMore";

// the default base service on which other services can extend.
export class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  // used to set the default relations to be retrieved with the entity
  // by the service actions.
  protected relations = [];

  async findAll(options: PagniationArgs & FindManyOptions<T>): Promise<PaginatedResponse<T>> {
    const [items, total] = await this.repository.findAndCount({ relations: this.relations, ...options });
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
      // it'll return true even if there are no rows affected.
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
