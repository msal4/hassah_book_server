import { InputType, Field } from "type-graphql";
import { IsNotEmpty, MaxLength } from "class-validator";

@InputType()
export class UpdateProfileInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Field()
  @MaxLength(100)
  province?: string;

  @Field()
  address?: string;
}
