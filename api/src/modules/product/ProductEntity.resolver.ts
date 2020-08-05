import { Service } from "typedi";
import { Resolver, FieldResolver, Root, Args } from "type-graphql";

import { Product } from "@api/entity/Product";
import { PagniationArgs } from "@api/modules/shared/PaginationArgs";
import { PaginatedFavoriteResponse } from "@api/shared/PaginatedResponse";
import { FavoriteService } from "@api/modules/services/Favorite.service";

@Service()
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
