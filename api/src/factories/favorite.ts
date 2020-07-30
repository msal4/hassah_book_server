import { define } from "typeorm-seeding";

import { Favorite } from "@api/entity/Favorite";
import { FavoriteFactoryContext } from "@api/factories/types/FactoryContext";

define(Favorite, (faker, context?: FavoriteFactoryContext) => {
  const favorite = new Favorite();
  favorite.user = Promise.resolve(context!.user);
  favorite.product = Promise.resolve(context!.product);
  favorite.createdAt = faker.date.past();
  return favorite;
});
