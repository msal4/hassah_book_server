import { InputType, Field, ID } from "type-graphql";
import { IsNotEmpty } from "class-validator";

import { CreatePublisherInput } from "@api/modules/publisher/publisher/CreatePublisherInput";

@InputType()
export class UpdatePublisherInput extends CreatePublisherInput {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;
}
