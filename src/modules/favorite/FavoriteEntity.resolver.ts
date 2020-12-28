import { Resolver, FieldResolver, Root, Ctx } from "type-graphql";

import { Favorite } from "@api/entity/Favorite";
import { User } from "@api/entity/User";
import { Product } from "@api/entity/Product";
import { RequestContext } from "@api/modules/types/RequestContext";

@Resolver(() => Favorite)
export class FavoriteEntityResolver {
  @FieldResolver(() => User)
  async user(@Ctx() { loaders }: RequestContext, @Root() { user }: Favorite): Promise<User> {
    return loaders.userLoader.load(user as any);
  }

  @FieldResolver(() => Product)
  product(@Ctx() { loaders }: RequestContext, @Root() favorite: Favorite): Promise<Product> {
    return loaders.productLoader.load(favorite.product as any);
  }
}
