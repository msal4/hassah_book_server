import DataLoader from "dataloader";
import { ClassType } from "type-graphql";
import { getRepository } from "typeorm";

import { User } from "@api/entity/User";
import { Product } from "@api/entity/Product";
import { Publisher } from "@api/entity/Publisher";
import { Author } from "@api/entity/Author";
import { Category } from "@api/entity/Category";
import { Collection } from "@api/entity/Collection";

type Id = string | { id: string };

const loader = <T extends { id: string }>(Entity: ClassType<T>) => {
  const batchLoadFn = async (ids: readonly Id[]): Promise<T[]> => {
    // Creating new entities returns an entity object with the relations being objects which contain the
    // id { id: "..."}, This is not what i want since i'm expecting a string. I could avoid this by
    // removing relations and returning only the id of the entity in create mutations. I could also use
    // .reload() method on the entity but I don't like it since I would have to write a lot of ifs.
    // I think a better way would be to check if it's an object here even though the loader has
    // nothing to do with it.
    // typeorm issue: https://github.com/typeorm/typeorm/issues/3490
    const allIds: string[] = ids.map((id) => (typeof id === "object" ? id.id : id));

    const items = await getRepository(Entity).findByIds(allIds);

    const mappedItems: { [key: string]: T } = items.reduce((map, item) => ({ ...map, [item.id]: item }), {});

    return allIds.map((id) => mappedItems[id]);
  };

  return new DataLoader((ids: readonly Id[]) => batchLoadFn(ids));
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
