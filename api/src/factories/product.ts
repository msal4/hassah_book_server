import { define } from "typeorm-seeding";

import { Product, ProductStatus } from "@api/entity/Product";
import { ProductFactoryContext } from "@api/factories/types/FactoryContext";
import { enumToList } from "@api/factories/utils/enumToList";
import { randomSlice } from "@api/factories/utils/randomSlice";

define(Product, (faker, context?: ProductFactoryContext) => {
  const product = new Product();

  product.name = faker.name.title();
  product.overview = faker.lorem.paragraph();
  product.image = faker.image.fashion(300, 550);
  product.status = faker.random.arrayElement(enumToList(ProductStatus));
  product.pages = faker.random.number(1000);
  product.publishedAt = faker.date.past();

  const publisher = faker.random.arrayElement(context!.publishers);
  product.publisher = publisher;

  const author = faker.random.arrayElement(context!.authors);
  product.author = author;

  const categoriesSlice = randomSlice(context!.categories);
  const collectionsSlice = randomSlice(context!.collections);

  product.categories = categoriesSlice;
  product.collections = collectionsSlice;

  return product;
});
