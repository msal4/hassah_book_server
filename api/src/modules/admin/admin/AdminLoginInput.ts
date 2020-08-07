import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsEmail } from "class-validator";

import { Admin } from "@api/entity/Admin";
import { IsAdminEmailAlreadyExist } from "@api/modules/admin/admin/IsAdminEmailAlreadyExist";

@InputType()
export class AdminLoginInput implements Partial<Admin> {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsAdminEmailAlreadyExist()
  password: string;
}
