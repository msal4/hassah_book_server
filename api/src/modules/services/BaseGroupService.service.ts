import { getRepository } from "typeorm";

import { PaginatedProductResponse } from "@api/shared/PaginatedResponse";
import { FindAllOptions } from "@api/modules/types/FindAllOptions";
import { PagniationArgs } from "@api/modules/shared/PaginationArgs";
import { BaseGroup } from "@api/modules/types/BaseGroup";

interface FindProductsOptions {
  groupId: string;
  paginationArgs: PagniationArgs;
}

export default class BaseGroupService<T extends BaseGroup> {
  constructor(private readonly groupEntityName: string) {}

  private get repository() {
    return getRepository<T>(this.groupEntityName);
  }

  async findProducts({
    groupId,
    paginationArgs: { skip, take },
  }: FindProductsOptions): Promise<PaginatedProductResponse> {
    const groupName = this.groupEntityName.toLowerCase();

    // since typeorm does not handle pagination for relations I have to write the query myself.
    // It should be resolved soon but for now this will do the trick.
    // issue: https://github.com/typeorm/typeorm/issues/5392
    const group = await this.repository
      .createQueryBuilder(groupName)
      .loadRelationCountAndMap(`${groupName}.totalProducts`, `${groupName}.products`)
      .innerJoinAndSelect(`${groupName}.products`, `${groupName}Product`, `${groupName}.id = :groupId`, {
        groupId,
      })
      .offset(skip)
      .limit(take)
      .getOne();

    if (!group) {
      return { items: [], total: 0, hasMore: false };
    }

    // group.products does not actually return a promise but since I defined it as Lazy in the entity
    // it is treated as such. This is related to the relation pagination issue mentioned above.
    return {
      items: await group.products,
      total: group.totalProducts!,
      hasMore: skip + take < group.totalProducts!,
    };
  }

  async findAll(options?: FindAllOptions<T>) {
    const [items, total] = await this.repository.findAndCount(options);
    return { items, total, hasMore: options!.skip + options!.take < total };
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.repository.delete(id);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
