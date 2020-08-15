import { InputType, Field } from "type-graphql";
import { IsNotEmpty, Length } from "class-validator";

import { VERIFICATION_CODE_LENGTH } from "@api/modules/constants/phone";

@InputType()
export class VerificationInput {
  @Field()
  @IsNotEmpty()
  sessionInfo: string;

  @Field()
  @Length(VERIFICATION_CODE_LENGTH, VERIFICATION_CODE_LENGTH)
  code: string;
}
