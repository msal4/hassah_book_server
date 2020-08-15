import { InputType, Field } from "type-graphql";
import { Length, MinLength } from "class-validator";

import { VerificationInput } from "@api/modules/user/user/VerficationCodeInput";
import { MIN_PASSWORD_LENGTH } from "@api/modules/constants/user";

@InputType()
export class RegisterInput extends VerificationInput {
  @Field()
  @Length(1, 50)
  name: string;

  @Field()
  @MinLength(MIN_PASSWORD_LENGTH)
  password: string;

  @Field({ nullable: true })
  address?: string;
}
