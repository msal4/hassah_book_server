import { define } from "typeorm-seeding";

import { Purchase } from "@api/entity/Purchase";
import { PurchaseFactoryContext } from "@api/factories/types/FactoryContext";

define(Purchase, (faker, context?: PurchaseFactoryContext) => {
  const purchase = new Purchase();
  purchase.product = Promise.resolve(context!.product);
  purchase.order = Promise.resolve(context!.order);
  purchase.quantity = faker.random.number(10);
  purchase.createdAt = faker.date.past();
  return purchase;
});
