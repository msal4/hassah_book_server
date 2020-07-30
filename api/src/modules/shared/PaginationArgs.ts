import { ArgsType, Field, Int } from "type-graphql";
import { Max } from "class-validator";

@ArgsType()
export class PagniationArgs {
  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true })
  @Max(100)
  take?: number;
}
