import { Arg, Args, Authorized, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";

import { OrderService } from "@api/modules/order/order/Order.service";
import { PaginatedOrderResponse } from "@api/modules/types/PaginatedResponse";
import { FilterArgs } from "@api/modules/types/FilterArgs";
import { RequestContext } from "@api/modules/types/RequestContext";
import { Order, OrderStatus } from "@api/entity/Order";
import { PlaceOrderInput } from "@api/modules/order/order/PlaceOrderInput";
import { UpdateOrderInput } from "@api/modules/order/order/UpdateOrderInput";
import { Roles } from "@api/modules/utils/auth";
import { ProductService } from "@api/modules/product/product/Product.service";
import { Product } from "@api/entity/Product";
import { PurchasePartialInput } from "@api/modules/purchase/PurchasePartialInput";

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService, private readonly productService: ProductService) {}

  @Query(() => Order, { nullable: true })
  order(@Arg("id", () => ID) id: string): Promise<Order | null> {
    return this.orderService.findOne({ where: { id } });
  }

  @Authorized(Roles.Admin)
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
  async placeOrder(@Ctx() { payload }: RequestContext, @Arg("data") data: PlaceOrderInput): Promise<Order> {
    const totalPrice = await this.calculateTotalPrice(data.purchases);

    const order = await this.orderService.create({ ...data, user: { id: payload!.userId }, totalPrice });

    this.orderService.sendNewOrderNotification(order.id);

    return order;
  }

  private async calculateTotalPrice(purchases: PurchasePartialInput[]): Promise<number> {
    // Get all the purchased products.
    const productIds = purchases.map((p) => p.product.id);
    const products = await this.productService.repository.findByIds(productIds);
    // Map each product to it's id to then retain the order of ids.
    const mappedProducts: { [key: string]: Product } = products.reduce(
      (map, item) => ({ ...map, [item.id]: item }),
      {}
    );
    // Sum the total.
    return purchases.reduce((total, p) => total + p.quantity * mappedProducts[p.product.id].price, 0);
  }

  @Authorized(Roles.User)
  @Mutation(() => Boolean)
  async cancelOrder(
    @Ctx() { payload }: RequestContext,
    @Arg("orderId", () => ID) orderId: string
  ): Promise<boolean> {
    const order = await this.orderService.repository.findOne({
      where: { id: orderId, user: { id: payload!.userId } },
    });

    // Cancel the order only when the status is pending.
    // I could've disallow users from canceling orders altogether but the user might've ordered by
    // mistake, so, we give them a chance of canceling only while the order is still pending.
    if (!order || order.status !== OrderStatus.Pending) return false;

    const res = await this.orderService.update({ id: order.id, status: OrderStatus.Canceled });

    this.orderService.sendOrderCanceledNotification(order.id);

    return res;
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  updateOrder(@Arg("data") data: UpdateOrderInput): Promise<boolean> {
    return this.orderService.update(data);
  }
}
