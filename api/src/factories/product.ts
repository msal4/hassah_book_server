import { define } from "typeorm-seeding";

import { Product, ProductStatus } from "@api/entity/Product";
import { ProductFactoryContext } from "@api/factories/types/FactoryContext";
import { enumToList } from "@api/factories/utils/enumToList";
import { randomSlice } from "@api/factories/utils/randomSlice";

define(Product, (faker, context?: ProductFactoryContext) => {
  const product = new Product();

  product.name = faker.name.title();
  product.overview = faker.lorem.paragraph();
  product.status = faker.random.arrayElement(enumToList(ProductStatus));
  product.pages = faker.random.number(1000);
  product.publishedAt = faker.date.past();
  product.type = Promise.resolve(context!.type);

  const publisher = faker.random.arrayElement(context!.publishers);
  product.publisher = Promise.resolve(publisher);

  const author = faker.random.arrayElement(context!.authors);
  product.author = Promise.resolve(author);

  const categoriesSlice = randomSlice(context!.categories);
  const collectionsSlice = randomSlice(context!.collections);
  console.log(categoriesSlice, collectionsSlice);
  product.categories = Promise.resolve(categoriesSlice);
  product.collections = Promise.resolve(collectionsSlice);

  return product;
});
