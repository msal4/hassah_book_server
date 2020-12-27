import { InputType, Field } from "type-graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateAuthorInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  overview: string;
}
