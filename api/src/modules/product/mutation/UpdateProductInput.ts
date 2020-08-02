import { Field, ID, InputType } from "type-graphql";

import { CreateProductInput } from "@api/modules/product/mutation/CreateProductInput";

@InputType({ description: "The input data for updating an existing product" })
export class UpdateProductInput extends CreateProductInput {
  @Field(() => ID)
  id: string;
}
