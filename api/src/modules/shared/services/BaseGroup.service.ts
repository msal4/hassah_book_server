import { getRepository } from "typeorm";

import { PaginatedProductResponse } from "@api/modules/shared/types/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { BaseGroup } from "@api/modules/shared/types/BaseGroup";
import { hasMore } from "@api/modules/utils/hasMore";
import { BaseService } from "@api/modules/shared/services/Base.service";

interface FindProductsOptions {
  groupId: string;
  paginationArgs: PagniationArgs;
}

export class BaseGroupService<T extends BaseGroup> extends BaseService<T> {
  constructor(private readonly groupEntityName: string) {
    super(getRepository<T>(groupEntityName));
  }

  async findProducts({
    groupId,
    paginationArgs: { skip, take },
  }: FindProductsOptions): Promise<PaginatedProductResponse> {
    const groupName = this.groupEntityName.toLowerCase();

    // Since typeorm does not handle pagination for relations I have to write the query myself.
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
      hasMore: hasMore({ skip, take }, group.totalProducts!),
    };
  }
}
