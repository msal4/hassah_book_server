import { EntityRepository, Repository, FindManyOptions } from "typeorm";
import { Service } from "typedi";

import { PaginatedFavoriteResponse } from "@api/shared/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/PaginationArgs";
import { Favorite } from "@api/entity/Favorite";

type Options = PagniationArgs & FindManyOptions<Favorite>;

@Service()
@EntityRepository()
export class FavoriteRepository extends Repository<Favorite> {
  async findAll(options: Options): Promise<PaginatedFavoriteResponse> {
    const [items, total] = await Favorite.findAndCount(options);
    return { items, total, hasMore: options.skip + options.take < total };
  }
}
