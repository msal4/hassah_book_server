import { Resolver, Mutation, Arg, Ctx, Authorized, Root, Args, Query, ID } from "type-graphql";

import { FavoriteService } from "@api/modules/favorite/favorite/Favorite.service";
import { RequestContext } from "@api/modules/types/RequestContext";
import { Roles } from "@api/modules/utils/auth";
import { PaginatedFavoriteResponse } from "@api/modules/types/PaginatedResponse";
import { PAGINATED_RESPONSE_COMPLEXITY } from "@api/modules/constants/query";
import { User } from "@api/entity/User";
import { FilterArgs } from "@api/modules/types/FilterArgs";

@Resolver()
export class FavoriteResolver {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Authorized(Roles.User)
  @Query(() => PaginatedFavoriteResponse, { complexity: PAGINATED_RESPONSE_COMPLEXITY })
  favorites(@Root() user: User, @Args() args: FilterArgs): Promise<PaginatedFavoriteResponse> {
    return this.favoriteService.findAll({ where: { user }, ...args });
  }

  @Authorized(Roles.User)
  @Mutation(() => Boolean)
  addFavorite(
    @Ctx() { payload }: RequestContext,
    @Arg("productId", () => ID) productId: string
  ): Promise<boolean> {
    return this.favoriteService.add({ userId: payload!.userId, productId });
  }

  @Authorized(Roles.User)
  @Mutation(() => Boolean)
  removeFavorite(
    @Ctx() { payload }: RequestContext,
    @Arg("favoriteId", () => ID) favoriteId: string
  ): Promise<boolean> {
    return this.favoriteService.remove({ userId: payload!.userId, favoriteId });
  }

  @Authorized(Roles.User)
  @Mutation(() => Boolean)
  removeFavoriteByProductId(
    @Ctx() { payload }: RequestContext,
    @Arg("productId", () => ID) productId: string
  ): Promise<boolean> {
    return this.favoriteService.remove({ userId: payload!.userId, productId });
  }
}
