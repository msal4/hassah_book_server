import { Resolver, FieldResolver, Root, Ctx } from "type-graphql";

import { UserRequest } from "@api/entity/UserRequest";
import { User } from "@api/entity/User";
import { RequestContext } from "@api/modules/types/RequestContext";

@Resolver(() => UserRequest)
export class UserRequestResolver {
  @FieldResolver(() => User)
  user(@Ctx() { loaders }: RequestContext, @Root() { user }: UserRequest): Promise<User> {
    return loaders.userLoader.load(user as any);
  }
}
