import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class SessionInfo {
  @Field()
  sessionInfo: string;
}
