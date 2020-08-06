import { Resolver, FieldResolver, Root } from "type-graphql";

import { UserRequest } from "@api/entity/UserRequest";
import { User } from "@api/entity/User";

@Resolver(() => UserRequest)
export class UserRequestResolver {
  @FieldResolver(() => User)
  async user(@Root() { id }: UserRequest): Promise<User> {
    const request = await UserRequest.findOne({ where: { id }, relations: ["user"] });
    return await request!.user;
  }
}
