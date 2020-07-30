import { define } from "typeorm-seeding";

import { Order, OrderStatus } from "@api/entity/Order";
import { OrderFactoryContext } from "@api/factories/types/FactoryContext";
import { enumToList } from "@api/factories/utils/enumToList";

define(Order, (faker, context?: OrderFactoryContext) => {
  const order = new Order();
  order.address = faker.address.streetAddress();
  order.user = Promise.resolve(context!.user);
  order.status = faker.random.arrayElement(enumToList(OrderStatus));
  order.createdAt = faker.date.past();
  return order;
});
