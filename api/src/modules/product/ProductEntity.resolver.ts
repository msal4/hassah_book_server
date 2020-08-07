import { Resolver, FieldResolver, Root, Args, Authorized } from "type-graphql";

import { Product } from "@api/entity/Product";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import {
  PaginatedFavoriteResponse,
  PaginatedPurchaseResponse,
} from "@api/modules/shared/types/PaginatedResponse";
import { FavoriteService } from "@api/modules/favorite/favorite/Favorite.service";
import { Roles } from "@api/modules/utils/auth";
import { PurchaseService } from "@api/modules/purchase/purchase/Purchase.service";

@Resolver(() => Product)
export class ProductEntityResolver {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly purchaseService: PurchaseService
  ) {}

  @Authorized(Roles.Admin)
  @FieldResolver(() => PaginatedFavoriteResponse)
  favorites(
    @Root() product: Product,
    @Args() { skip, take }: PagniationArgs
  ): Promise<PaginatedFavoriteResponse> {
    return this.favoriteService.findAll({ skip, take, where: { product } });
  }

  @Authorized(Roles.Admin)
  @FieldResolver(() => PaginatedPurchaseResponse)
  purchases(
    @Root() product: Product,
    @Args() { skip, take }: PagniationArgs
  ): Promise<PaginatedPurchaseResponse> {
    return this.purchaseService.findAll({ skip, take, where: { product } });
  }
}
