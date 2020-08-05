import { InputType, Field } from "type-graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreatePublisherInput {
  @Field()
  @IsNotEmpty()
  name: string;
}
