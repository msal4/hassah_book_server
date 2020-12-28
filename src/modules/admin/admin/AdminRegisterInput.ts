import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsEmail } from "class-validator";

import { AdminLoginInput } from "@api/modules/admin/admin/AdminLoginInput";
import { IsAdminEmailNotUsed } from "@api/modules/admin/admin/IsAdminEmailNotUsed";

@InputType()
export class AdminRegisterInput extends AdminLoginInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  @IsAdminEmailNotUsed()
  email: string;
}
