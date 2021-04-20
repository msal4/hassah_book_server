import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsPhoneNumber } from "class-validator";

import { PurchasePartialInput } from "@api/modules/purchase/PurchasePartialInput";

@InputType()
export class PlaceOrderInput {
  @Field()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsNotEmpty()
  province: string;

  @Field()
  @IsPhoneNumber("IQ")
  phone: string;

  @Field(() => [PurchasePartialInput])
  purchases: PurchasePartialInput[];
}
