import { Field, ID, InputType } from "type-graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

import { IsAdminEmailNotUsed } from "@api/modules/admin/admin/IsAdminEmailNotUsed";
import { MIN_PASSWORD_LENGTH } from "@api/modules/constants/user";

@InputType()
export class AdminUpdateInput {
  @Field(() => ID, { nullable: true })
  @IsNotEmpty()
  id?: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  name?: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @IsEmail()
  @IsAdminEmailNotUsed()
  email?: string;

  @Field({ nullable: true })
  @MinLength(MIN_PASSWORD_LENGTH)
  password?: string;
}
