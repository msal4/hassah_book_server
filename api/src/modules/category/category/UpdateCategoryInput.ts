import { InputType, Field, ID } from "type-graphql";
import { IsNotEmpty } from "class-validator";

import { CreateCategoryInput } from "@api/modules/category/category/CreateCategoryInput";

@InputType()
export class UpdateCategoryInput extends CreateCategoryInput {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;
}
