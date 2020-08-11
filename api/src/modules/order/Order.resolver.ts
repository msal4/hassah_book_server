import { Resolver, Query, Args, Ctx, Mutation, Arg, Authorized } from "type-graphql";

import { OrderService } from "@api/modules/order/order/Order.service";
import { PaginatedOrderResponse } from "@api/modules/shared/types/PaginatedResponse";
import { FilterArgs } from "@api/modules/shared/types/FilterArgs";
import { RequestContext } from "@api/modules/shared/types/RequestContext";
import { Order, OrderStatus } from "@api/entity/Order";
import { PlaceOrderInput } from "@api/modules/order/order/PlaceOrderInput";
import { UpdateOrderInput } from "@api/modules/order/order/UpdateOrderInput";
import { Roles } from "@api/modules/utils/auth";

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  // TODO: authorization needed. Admin only.
  @Query(() => PaginatedOrderResponse)
  orders(@Args() args: FilterArgs): Promise<PaginatedOrderResponse> {
    return this.orderService.findAll(args);
  }

  @Authorized(Roles.User)
  @Query(() => PaginatedOrderResponse)
  myOrders(@Ctx() { payload }: RequestContext, @Args() args: FilterArgs): Promise<PaginatedOrderResponse> {
    return this.orderService.findAll({ where: { user: { id: payload!.userId } }, ...args });
  }

  @Authorized(Roles.User)
  @Mutation(() => Order)
  placeOrder(@Ctx() { payload }: RequestContext, @Arg("data") data: PlaceOrderInput): Promise<Order> {
    return this.orderService.create({ ...data, user: { id: payload!.userId } });
  }

  @Authorized(Roles.User)
  @Mutation(() => Boolean)
  async cancelOrder(@Ctx() { payload }: RequestContext, @Arg("orderId") orderId: string): Promise<boolean> {
    const order = await this.orderService.repository.findOne({
      where: { id: orderId, user: { id: payload!.userId } },
    });

    // Cancel the order only when the status is pending.
    // I could've disallow users from canceling orders altogether but the user might've ordered by
    // mistake, so, we give them a chance of canceling only while the order is still pending.
    if (!order || order.status !== OrderStatus.Pending) return false;

    return await this.orderService.update({ id: order.id, status: OrderStatus.Canceled });
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  updateOrder(@Arg("data") data: UpdateOrderInput): Promise<boolean> {
    return this.orderService.update(data);
  }
}
