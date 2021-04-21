import { InputType, Field, ID } from "type-graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdateProfileInput {
  @Field(() => ID)
  id: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  address?: string;
}
