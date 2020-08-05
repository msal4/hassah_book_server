import { InputType, Field, ID } from "type-graphql";
import { IsNotEmpty } from "class-validator";

import { CreateAuthorInput } from "@api/modules/author/author/CreateAuthorInput";

@InputType()
export class UpdateAuthorInput extends CreateAuthorInput {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;
}
