import DataLoader from "dataloader";
import { ClassType } from "type-graphql";
import { getRepository } from "typeorm";

import { User } from "@api/entity/User";
import { Product } from "@api/entity/Product";

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
});

export type Loaders = ReturnType<typeof createLoaders>;
