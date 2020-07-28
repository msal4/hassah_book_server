import { Field, InputType } from "type-graphql";
import { Length, IsPhoneNumber, MinLength } from "class-validator";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 50)
  name: string;

  @Field()
  @IsPhoneNumber("IQ")
  phone: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field({ nullable: true })
  address?: string;
}
