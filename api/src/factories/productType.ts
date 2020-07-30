import { define } from "typeorm-seeding";

import { ProductType } from "@api/entity/ProductType";

define(ProductType, _ => {
  const type = new ProductType();
  type.name = "Books";
  return type;
});
