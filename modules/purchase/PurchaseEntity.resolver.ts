import { Resolver, FieldResolver, Root, Ctx } from "type-graphql";

import { RequestContext } from "@api/modules/types/RequestContext";
import { Product } from "@api/entity/Product";
import { Purchase } from "@api/entity/Purchase";
import { Order } from "@api/entity/Order";

@Resolver(() => Purchase)
export class PurchaseEntityResolver {
  @FieldResolver(() => Product)
  product(@Root() { product }: Purchase, @Ctx() { loaders }: RequestContext): Promise<Product> {
    return loaders.productLoader.load(product as any);
  }

  @FieldResolver(() => Order)
  order(@Root() { order }: Purchase, @Ctx() { loaders }: RequestContext): Promise<Order> {
    return loaders.orderLoader.load(order as any);
  }
}
