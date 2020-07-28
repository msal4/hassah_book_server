import { Field, InputType } from "type-graphql";
import { IsPhoneNumber, IsNotEmpty } from "class-validator";

@InputType()
export class LoginInput {
  @Field()
  @IsPhoneNumber("IQ")
  phone: string;

  @Field()
  @IsNotEmpty()
  password: string;
}
