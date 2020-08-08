import { Resolver, FieldResolver, Root, Ctx } from "type-graphql";

import { Order } from "@api/entity/Order";
import { User } from "@api/entity/User";
import { PaginatedPurchaseResponse } from "@api/modules/shared/types/PaginatedResponse";
import { PurchaseService } from "@api/modules/purchase/purchase/Purchase.service";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { RequestContext } from "@api/modules/shared/types/RequestContext";

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly purchaseService: PurchaseService) {}

  @FieldResolver(() => User)
  async user(@Ctx() { loaders }: RequestContext, @Root() { user }: Order): Promise<User> {
    return loaders.userLoader.load(user as any);
  }

  @FieldResolver(() => PaginatedPurchaseResponse)
  purchases(@Root() { id }: Order, args: PagniationArgs): Promise<PaginatedPurchaseResponse> {
    return this.purchaseService.findAll({ where: { order: { id } }, ...args });
  }
}
