import { InputType, Field } from "type-graphql";
import { IsNotEmpty } from "class-validator";

import { Category } from "@api/entity/Category";

@InputType()
export class CreateCollectionInput implements Partial<Category> {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  image: string;
}
