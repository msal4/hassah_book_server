import { define } from "typeorm-seeding";

import { Category } from "@api/entity/Category";

define(Category, (faker) => {
  const category = new Category();
  category.name = faker.name.jobType();
  return category;
});
