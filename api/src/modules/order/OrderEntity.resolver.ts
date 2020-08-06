import { Resolver, FieldResolver, Root } from "type-graphql";

import { Order } from "@api/entity/Order";
import { User } from "@api/entity/User";
import { PaginatedPurchaseResponse } from "@api/modules/shared/types/PaginatedResponse";
import { PurchaseService } from "@api/modules/purchase/purchase/Purchase.service";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly purchaseService: PurchaseService) {}

  @FieldResolver(() => User)
  async user(@Root() { id }: Order): Promise<User> {
    const order = await Order.findOne({ where: { id }, relations: ["user"] });
    return await order!.user;
  }

  @FieldResolver(() => PaginatedPurchaseResponse)
  purchases(@Root() { id }: Order, args: PagniationArgs): Promise<PaginatedPurchaseResponse> {
    return this.purchaseService.findAll({ where: { order: { id } }, ...args });
  }
}
