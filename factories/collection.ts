import { define } from "typeorm-seeding";

import { Collection } from "@api/entity/Collection";

define(Collection, (faker) => {
  const collection = new Collection();
  collection.name = faker.name.jobType();
  collection.image = faker.image.abstract();
  return collection;
});
