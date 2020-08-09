import DataLoader from "dataloader";
import { ClassType } from "type-graphql";
import { getRepository } from "typeorm";

import { User } from "@api/entity/User";
import { Product } from "@api/entity/Product";
import { Publisher } from "@api/entity/Publisher";
import { Author } from "@api/entity/Author";
import { Category } from "@api/entity/Category";
import { Collection } from "@api/entity/Collection";

const loader = <T extends { id: string }>(Entity: ClassType<T>) => {
  const batchLoadFn = async (ids: readonly string[]): Promise<T[]> => {
    const items = await getRepository(Entity).findByIds(ids as string[]);

    const mappedItems: { [key: string]: T } = items.reduce((map, item) => ({ ...map, [item.id]: item }), {});

    return ids.map((id) => mappedItems[id]);
  };

  return new DataLoader((ids: readonly string[]) => batchLoadFn(ids));
};

export const createLoaders = () => ({
  userLoader: loader(User),
  productLoader: loader(Product),
  authorLoader: loader(Author),
  publisherLoader: loader(Publisher),
  categoriesLoader: loader(Category),
  collectionsLoader: loader(Collection),
});

export type Loaders = ReturnType<typeof createLoaders>;
