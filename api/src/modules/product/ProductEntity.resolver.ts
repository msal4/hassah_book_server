import { Resolver, FieldResolver, Root, Args } from "type-graphql";

import { Product } from "@api/entity/Product";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { PaginatedFavoriteResponse } from "@api/modules/shared/types/PaginatedResponse";
import { FavoriteService } from "@api/modules/favorite/favorite/Favorite.service";

@Resolver(() => Product)
export class ProductEntityResolver {
  constructor(private readonly favoriteService: FavoriteService) {}

  @FieldResolver(() => PaginatedFavoriteResponse)
  favorites(
    @Root() product: Product,
    @Args() { skip, take }: PagniationArgs
  ): Promise<PaginatedFavoriteResponse> {
    return this.favoriteService.findAll({ skip, take, where: { product } });
  }
}
