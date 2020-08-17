import { Resolver, Mutation, Arg, Ctx, Authorized } from "type-graphql";

import { FavoriteService } from "@api/modules/favorite/favorite/Favorite.service";
import { RequestContext } from "@api/modules/types/RequestContext";
import { Roles } from "@api/modules/utils/auth";

@Resolver()
export class FavoriteResolver {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Authorized(Roles.User)
  @Mutation(() => Boolean)
  addFavorite(@Ctx() { payload }: RequestContext, @Arg("productId") productId: string): Promise<boolean> {
    return this.favoriteService.add({ userId: payload!.userId, productId });
  }

  @Authorized(Roles.User)
  @Mutation(() => Boolean)
  removeFavorite(
    @Ctx() { payload }: RequestContext,
    @Arg("favoriteId") favoriteId: string
  ): Promise<boolean> {
    return this.favoriteService.remove({ userId: payload!.userId, favoriteId });
  }

  @Authorized(Roles.User)
  @Mutation(() => Boolean)
  removeFavoriteByProductId(
    @Ctx() { payload }: RequestContext,
    @Arg("productId") productId: string
  ): Promise<boolean> {
    return this.favoriteService.remove({ userId: payload!.userId, productId });
  }
}
