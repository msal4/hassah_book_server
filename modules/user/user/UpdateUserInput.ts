import { Field, ID, InputType } from "type-graphql";
import { IsPhoneNumber, Length, MinLength } from "class-validator";

import { MIN_PASSWORD_LENGTH } from "@api/modules/constants/user";

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  id: string;

  @Field()
  @Length(1, 50)
  name: string;

  @Field({ nullable: true })
  @MinLength(MIN_PASSWORD_LENGTH)
  password?: string;

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
