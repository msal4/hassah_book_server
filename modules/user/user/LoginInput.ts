import { Field, InputType } from "type-graphql";
import { IsPhoneNumber, IsNotEmpty } from "class-validator";

import { User } from "@api/entity/User";

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  @IsPhoneNumber("IQ")
  phone: string;

  @Field()
  @IsNotEmpty()
  password: string;
}
