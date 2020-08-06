import { Field, ID, InputType } from "type-graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class ObjectId {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;
}
