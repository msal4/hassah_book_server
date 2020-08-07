import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsEmail } from "class-validator";

import { AdminLoginInput } from "@api/modules/admin/admin/AdminLoginInput";
import { IsAdminEmailAlreadyExist } from "@api/modules/admin/admin/IsAdminEmailAlreadyExist";

@InputType()
export class AdminRegisterInput extends AdminLoginInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  @IsAdminEmailAlreadyExist()
  email: string;
}
