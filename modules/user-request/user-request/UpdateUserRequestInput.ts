import { InputType, Field, ID } from "type-graphql";
import { IsNotEmpty } from "class-validator";

import { CreateUserRequestInput } from "@api/modules/user-request/user-request/CreateUserRequestInput";
import { UserRequestStatus } from "@api/entity/UserRequest";

@InputType()
export class UpdateUserRequestInput extends CreateUserRequestInput {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field(() => UserRequestStatus)
  status: UserRequestStatus;
}
