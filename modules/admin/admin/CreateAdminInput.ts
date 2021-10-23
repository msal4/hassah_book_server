import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsEmail } from "class-validator";

import { LoginAdminInput } from "@api/modules/admin/admin/LoginAdminInput";
import { IsAdminEmailNotUsed } from "@api/modules/admin/admin/IsAdminEmailNotUsed";

@InputType()
export class CreateAdminInput extends LoginAdminInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  @IsAdminEmailNotUsed()
  email: string;
}
