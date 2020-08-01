import { Resolver, FieldResolver, Root, Args } from "type-graphql";

import { Product } from "@api/entity/Product";
import { PagniationArgs } from "@api/modules/shared/PaginationArgs";
import { PaginatedFavoriteResponse } from "@api/shared/PaginatedResponse";
import { FavoriteRepository } from "@api/modules/repositories/FavoriteRepository";

@Resolver(() => Product)
export class ProductEntityResolver {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  @FieldResolver(() => PaginatedFavoriteResponse)
  async favorites(
    @Root() product: Product,
    @Args() args: PagniationArgs
  ): Promise<PaginatedFavoriteResponse> {
    return await this.favoriteRepository.findAll({
      ...args,
      where: { product },
    });
  }
}
