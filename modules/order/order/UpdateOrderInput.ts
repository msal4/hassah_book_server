import { InputType, Field } from "type-graphql";

import { ObjectIdInput } from "@api/modules/types/ObjectIdInput";
import { OrderStatus } from "@api/entity/Order";

@InputType()
export class UpdateOrderInput extends ObjectIdInput {
  @Field(() => OrderStatus)
  status: OrderStatus;
}
