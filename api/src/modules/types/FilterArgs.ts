import { ArgsType, Field, Int, registerEnumType, InputType } from "type-graphql";
import { Max, Min, IsNotEmpty } from "class-validator";

export enum OrderType {
  ASC = "ASC",
  DESC = "DESC",
}

registerEnumType(OrderType, { name: "OrderBy" });

@InputType()
export class OrderByMap {
  @Field()
  @IsNotEmpty()
  field: string;

  @Field(() => OrderType)
  order: OrderType;
}

@ArgsType()
export class FilterArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Min(0)
  skip: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @Min(1)
  @Max(100)
  take: number;

  @Field(() => [OrderByMap], { nullable: true })
  order?: OrderByMap[];
}
