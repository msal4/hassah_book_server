import { InputType, Field } from "type-graphql";
import { IsNotEmpty, Length, MinLength } from "class-validator";

import { VERIFICATION_CODE_LENGTH } from "@api/modules/constants/phone";

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty()
  sessionInfo: string;

  @Field()
  @Length(VERIFICATION_CODE_LENGTH, VERIFICATION_CODE_LENGTH)
  code: string;

  @Field()
  @Length(1, 50)
  name: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field({ nullable: true })
  address?: string;
}
