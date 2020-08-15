import { InputType, Field } from "type-graphql";
import { Length, MinLength } from "class-validator";

import { VerificationInput } from "@api/modules/user/user/VerficationCodeInput";

@InputType()
export class RegisterInput extends VerificationInput {
  @Field()
  @Length(1, 50)
  name: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field({ nullable: true })
  address?: string;
}
