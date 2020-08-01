import { Field, InputType } from "type-graphql";
import { Length, IsPhoneNumber, MinLength } from "class-validator";

import { User } from "@api/entity/User";

@InputType()
export class RegisterInput implements Partial<User> {
  @Field()
  @Length(1, 50)
  name: string;

  @Field()
  @IsPhoneNumber("IQ")
  phone: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field({ nullable: true })
  address?: string;
}
