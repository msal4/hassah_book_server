import { Resolver, FieldResolver, Root, Ctx, Args, Float } from "type-graphql";

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

  @FieldResolver(() => Float)
  async totalPrice(@Root() { id }: Order): Promise<number> {
    const res = await this.purchaseService.repository.query(
      `SELECT COALESCE(SUM(product.price), 0) as total FROM purchase INNER JOIN product ON product.id = "productId" WHERE "orderId" = $1`,
      [id]
    );

    return res[0].total;
  }

  @FieldResolver(() => User)
  user(@Ctx() { loaders }: RequestContext, @Root() { user }: Order): Promise<User> {
    return loaders.userLoader.load(user as any);
  }

  @FieldResolver(() => PaginatedPurchaseResponse, { complexity: PAGINATED_RESPONSE_COMPLEXITY })
  purchases(@Root() { id }: Order, @Args() args: FilterArgs): Promise<PaginatedPurchaseResponse> {
    return this.purchaseService.findAll({ where: { order: { id } }, ...args });
  }
}
