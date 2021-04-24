import DataLoader from "dataloader";
import { BaseEntity } from "typeorm";

import { BaseService } from "@api/modules/services/Base.service";
import { Container } from "typedi";
import { UserService } from "@api/modules/user/user/User.service";
import { ProductService } from "@api/modules/product/product/Product.service";
import { AuthorService } from "@api/modules/author/author/Author.service";
import { PublisherService } from "@api/modules/publisher/publisher/Publisher.service";
import { CategoryService } from "@api/modules/category/category/Category.service";
import { CollectionService } from "@api/modules/collection/collection/Collection.service";
import { OrderService } from "@api/modules/order/order/Order.service";

type Id = string | { id: string };

const loader = <T extends BaseEntity & { id: string }>(service: BaseService<T>) => {
  const batchLoadFn = async (ids: readonly Id[]): Promise<T[]> => {
    // Creating new entities returns an entity object with the relations being objects which contain the
    // id { id: "..."}, This is not what i want since i'm expecting a string. I could avoid this by
    // removing relations and returning only the id of the entity in create mutations. I could also use
    // .reload() method on the entity but I don't like it since I would have to write a lot of ifs.
    // I think a better way would be to check if it's an object here even though the loader has
    // nothing to do with it.
    // typeorm issue: https://github.com/typeorm/typeorm/issues/3490
    const allIds: string[] = ids.map((id) => (typeof id === "object" ? id.id : id));

    const items = await service.findByIds(allIds);

    const mappedItems: { [key: string]: T } = items.reduce((map, item) => ({ ...map, [item.id]: item }), {});

    return allIds.map((id) => mappedItems[id]);
  };

  return new DataLoader((ids: readonly Id[]) => batchLoadFn(ids));
};

export const createLoaders = () => ({
  userLoader: loader(Container.get(UserService)),
  productLoader: loader(Container.get(ProductService)),
  authorLoader: loader(Container.get(AuthorService)),
  publisherLoader: loader(Container.get(PublisherService)),
  categoryLoader: loader(Container.get(CategoryService)),
  collectionLoader: loader(Container.get(CollectionService)),
  orderLoader: loader(Container.get(OrderService)),
});

export type Loaders = ReturnType<typeof createLoaders>;
