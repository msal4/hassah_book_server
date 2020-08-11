import { ArgsType, Field, Int } from "type-graphql";
import { Max, Min } from "class-validator";

@ArgsType()
export class FilterArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Min(0)
  skip: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @Min(1)
  @Max(100)
  take: number;
}
