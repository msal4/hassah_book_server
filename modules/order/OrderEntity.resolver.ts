import { Resolver, FieldResolver, Root, Ctx, Args } from "type-graphql";

import { Order } from "@api/entity/Order";
import { User } from "@api/entity/User";
import { PaginatedPurchaseResponse } from "@api/modules/types/PaginatedResponse";
import { PurchaseService } from "@api/modules/purchase/Purchase.service";
import { FilterArgs } from "@api/modules/types/FilterArgs";
import { RequestContext } from "@api/modules/types/RequestContext";
import { PAGINATED_RESPONSE_COMPLEXITY } from "@api/modules/constants/query";

@Resolver(() => Order)
export class OrderEntityResolver {
  constructor(private readonly purchaseService: PurchaseService) {}

  @FieldResolver(() => User)
  user(@Ctx() { loaders }: RequestContext, @Root() { user }: Order): Promise<User> {
    return loaders.userLoader.load(user as any);
  }

  @FieldResolver(() => PaginatedPurchaseResponse, { complexity: PAGINATED_RESPONSE_COMPLEXITY })
  purchases(@Root() { id }: Order, @Args() args: FilterArgs): Promise<PaginatedPurchaseResponse> {
    return this.purchaseService.findAll({ where: { order: { id } }, ...args });
  }
}
