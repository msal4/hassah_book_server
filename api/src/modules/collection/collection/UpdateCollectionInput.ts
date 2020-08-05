import { InputType, Field, ID } from "type-graphql";
import { IsNotEmpty } from "class-validator";

import { CreateCollectionInput } from "@api/modules/collection/collection/CreateCollectionInput";

@InputType()
export class UpdateCollectionInput extends CreateCollectionInput {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;
}
