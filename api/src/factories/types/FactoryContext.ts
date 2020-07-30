import { ProductType } from "@api/entity/ProductType";
import { Publisher } from "@api/entity/Publisher";
import { Author } from "@api/entity/Author";
import { User } from "@api/entity/User";
import { Product } from "@api/entity/Product";
import { Order } from "@api/entity/Order";
import { Category } from "@api/entity/Category";
import { Collection } from "@api/entity/Collection";

export interface ProductFactoryContext {
  type: ProductType;
  publishers: Publisher[];
  authors: Author[];
  categories: Category[];
  collections: Collection[];
}

export interface UserRequestFactoryContext {
  user: User;
}

export interface FavoriteFactoryContext {
  user: User;
  product: Product;
}

export interface OrderFactoryContext {
  user: User;
}

export interface PurchaseFactoryContext {
  product: Product;
  order: Order;
}
