import { Field, ID, InputType } from "type-graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class ObjectIdInput {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;
}
