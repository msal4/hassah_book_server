import { InputType, Field } from "type-graphql";
import { MinLength } from "class-validator";

import { MIN_PASSWORD_LENGTH } from "@api/modules/constants/user";
import { VerificationInput } from "@api/modules/user/user/VerficationCodeInput";

@InputType()
export class UpdatePasswordInput extends VerificationInput {
  @Field()
  @MinLength(MIN_PASSWORD_LENGTH)
  password: string;
}
