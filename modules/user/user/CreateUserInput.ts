import { InputType, Field } from "type-graphql";
import { IsPhoneNumber, Length, MinLength } from "class-validator";

import { MIN_PASSWORD_LENGTH } from "@api/modules/constants/user";

@InputType()
export class CreateUserInput {
  @Field()
  @Length(1, 50)
  name: string;

  @Field()
  @MinLength(MIN_PASSWORD_LENGTH)
  password: string;

  @Field({ nullable: true })
  province?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  confirmed?: boolean;

  @Field()
  @IsPhoneNumber("IQ")
  phone: string;
}
