import { FindManyOptions } from "typeorm";
import { Service } from "typedi";

import { PaginatedFavoriteResponse } from "@api/modules/shared/types/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { Favorite } from "@api/entity/Favorite";

type Options = PagniationArgs & FindManyOptions<Favorite>;

@Service()
export class FavoriteService {
  async findAll(options: Options): Promise<PaginatedFavoriteResponse> {
    const [items, total] = await Favorite.findAndCount(options);
    return { items, total, hasMore: options.skip + options.take < total };
  }
}
