import { InputType, Field } from "type-graphql";
import { IsNotEmpty } from "class-validator";

import { UserRequest } from "@api/entity/UserRequest";

@InputType()
export class CreateUserRequestInput implements Partial<UserRequest> {
  @Field()
  @IsNotEmpty()
  content: string;
}
