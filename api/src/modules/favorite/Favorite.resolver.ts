import { Resolver, Mutation, UseMiddleware, Arg, Ctx } from "type-graphql";

import { FavoriteService } from "@api/modules/favorite/favorite/Favorite.service";
import { isAuth } from "@api/modules/middleware/isAuth";
import { RequestContext } from "@api/modules/shared/types/RequestContext";

@Resolver()
export class FavoriteResolver {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  addFavorite(@Ctx() { payload }: RequestContext, @Arg("productId") productId: string): Promise<boolean> {
    return this.favoriteService.add({ userId: payload!.userId, productId });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  removeFavorite(
    @Ctx() { payload }: RequestContext,
    @Arg("favoriteId") favoriteId: string
  ): Promise<boolean> {
    return this.favoriteService.remove({ userId: payload!.userId, favoriteId });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  removeFavoriteByProductId(
    @Ctx() { payload }: RequestContext,
    @Arg("productId") productId: string
  ): Promise<boolean> {
    return this.favoriteService.remove({ userId: payload!.userId, productId });
  }
}
