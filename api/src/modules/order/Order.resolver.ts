import { Resolver, Query, Args, UseMiddleware, Ctx, Mutation, Arg } from "type-graphql";

import { OrderService } from "@api/modules/order/order/Order.service";
import { PaginatedOrderResponse } from "@api/modules/shared/types/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { isAuth } from "@api/modules/middleware/isAuth";
import { RequestContext } from "@api/modules/shared/types/RequestContext";
import { Order, OrderStatus } from "@api/entity/Order";
import { PlaceOrderInput } from "@api/modules/order/order/PlaceOrderInput";
import { UpdateOrderInput } from "@api/modules/order/order/UpdateOrderInput";

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  // TODO: authorization needed. Admin only.
  @Query(() => PaginatedOrderResponse)
  orders(@Args() args: PagniationArgs): Promise<PaginatedOrderResponse> {
    return this.orderService.findAll(args);
  }

  @Query(() => PaginatedOrderResponse)
  @UseMiddleware(isAuth)
  myOrders(
    @Ctx() { payload }: RequestContext,
    @Args() args: PagniationArgs
  ): Promise<PaginatedOrderResponse> {
    return this.orderService.findAll({ where: { user: { id: payload!.userId } }, ...args });
  }

  @Mutation(() => Order)
  @UseMiddleware(isAuth)
  placeOrder(@Ctx() { payload }: RequestContext, @Arg("data") data: PlaceOrderInput): Promise<Order> {
    return this.orderService.create({ ...data, user: { id: payload!.userId } });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async cancelOrder(@Ctx() { payload }: RequestContext, @Arg("orderId") orderId: string): Promise<boolean> {
    const order = await this.orderService.repository.findOne({
      where: { id: orderId, user: { id: payload!.userId } },
    });

    // Cancel the order only when the status is pending.
    // I could've disallow users from canceling orders but the user could've ordered by
    // mistake, so, we give them a chance of canceling only when the order is still pending.
    if (!order || order.status !== OrderStatus.Pending) return false;

    return await this.orderService.update({ id: order.id, status: OrderStatus.Canceled });
  }

  // TODO: admin only.
  @Mutation(() => Boolean)
  updateOrder(@Arg("data") data: UpdateOrderInput): Promise<boolean> {
    return this.orderService.update(data);
  }
}
