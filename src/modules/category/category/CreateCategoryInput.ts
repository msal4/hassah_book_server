import { InputType, Field } from "type-graphql";
import { IsNotEmpty } from "class-validator";

import { Category } from "@api/entity/Category";

@InputType()
export class CreateCategoryInput implements Partial<Category> {
  @Field()
  @IsNotEmpty()
  name: string;
}
