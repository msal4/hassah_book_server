import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsEmail } from "class-validator";

import { Admin } from "@api/entity/Admin";

@InputType()
export class LoginAdminInput implements Partial<Admin> {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}
