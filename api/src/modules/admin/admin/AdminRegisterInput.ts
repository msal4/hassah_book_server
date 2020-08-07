import { InputType, Field } from "type-graphql";
import { IsNotEmpty } from "class-validator";

import { AdminLoginInput } from "@api/modules/admin/admin/AdminLoginInput";

@InputType()
export class AdminRegisterInput extends AdminLoginInput {
  @Field()
  @IsNotEmpty()
  name: string;
}
