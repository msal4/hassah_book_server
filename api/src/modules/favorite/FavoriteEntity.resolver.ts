import { Resolver, FieldResolver, Root } from "type-graphql";

import { Favorite } from "@api/entity/Favorite";
import { User } from "@api/entity/User";
import { Product } from "@api/entity/Product";

@Resolver(() => Favorite)
export class FavoriteEntityResolver {
  @FieldResolver(() => User)
  async user(@Root() { id }: Favorite): Promise<User> {
    const favorite = await Favorite.findOne({ where: { id }, relations: ["user"] });
    return await favorite!.user;
  }

  @FieldResolver(() => Product)
  async product(@Root() { id }: Favorite): Promise<Product> {
    const favorite = await Favorite.findOne({ where: { id }, relations: ["product"] });
    return await favorite!.product;
  }
}
