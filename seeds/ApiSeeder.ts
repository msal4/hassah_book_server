import { Seeder, Factory } from "typeorm-seeding";
import { Connection } from "typeorm";
import faker from "faker";

import { Product } from "@api/entity/Product";
import {
  ProductFactoryContext,
  FavoriteFactoryContext,
  UserRequestFactoryContext,
  OrderFactoryContext,
  PurchaseFactoryContext,
} from "@api/factories/types/FactoryContext";
import { Publisher } from "@api/entity/Publisher";
import { Author } from "@api/entity/Author";
import { User } from "@api/entity/User";
import { UserRequest } from "@api/entity/UserRequest";
import { Favorite } from "@api/entity/Favorite";
import { Category } from "@api/entity/Category";
import { Collection } from "@api/entity/Collection";
import { Order } from "@api/entity/Order";
import { Purchase } from "@api/entity/Purchase";
import { randomSlice } from "@api/factories/utils/randomSlice";

export class ApiSeeder implements Seeder {
  public async run(factory: Factory, _connection: Connection): Promise<void> {
    const products = await this.createProducts(factory);
    const users = await this.createUsers(factory);
    for (const user of users) {
      await this.createUserRequests(factory, user);

      const productsSlice = randomSlice(products);
      await this.createFavorites(factory, user, productsSlice);
      const orders = await this.createOrders(factory, user);
      for (const order of orders) {
        const orderProducts = randomSlice(productsSlice);
        await this.createPurchases(factory, orderProducts, order);
      }
    }
  }

  createCategories(factory: Factory) {
    return factory(Category)().createMany(10);
  }

  createCollections(factory: Factory) {
    return factory(Collection)().createMany(10);
  }

  async createProducts(factory: Factory) {
    const publishers = await factory(Publisher)().createMany(10);
    const authors = await factory(Author)().createMany(10);
    const categories = await this.createCategories(factory);
    const collections = await this.createCollections(factory);
    const context: ProductFactoryContext = {
      publishers,
      authors,
      categories,
      collections,
    };
    return await factory(Product)(context).createMany(10);
  }

  createUsers(factory: Factory) {
    return factory(User)().createMany(5);
  }

  createUserRequests(factory: Factory, user: User) {
    return factory(UserRequest)({
      user,
    } as UserRequestFactoryContext).createMany(10);
  }

  async createFavorites(factory: Factory, user: User, products: Product[]) {
    for (const product of products) {
      await factory(Favorite)({
        user,
        product,
      } as FavoriteFactoryContext).create();
    }
  }

  createOrders(factory: Factory, user: User) {
    return factory(Order)({ user } as OrderFactoryContext).createMany(faker.random.number(5));
  }

  async createPurchases(factory: Factory, products: Product[], order: Order) {
    for (const product of products) {
      await factory(Purchase)({
        product,
        order,
      } as PurchaseFactoryContext).create();
    }
  }
}
