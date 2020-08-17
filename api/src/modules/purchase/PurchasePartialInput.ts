import { Field, Int, InputType } from "type-graphql";
import { Min } from "class-validator";

import { ObjectIdInput } from "@api/modules/types/ObjectIdInput";

@InputType()
export class PurchasePartialInput {
  @Field(() => Int)
  @Min(1)
  quantity: number;

  @Field(() => ObjectIdInput)
  product: ObjectIdInput;
}
