import { Resolver, FieldResolver, Root, Ctx } from "type-graphql";

import { UserRequest } from "@api/entity/UserRequest";
import { User } from "@api/entity/User";
import { RequestContext } from "@api/modules/shared/types/RequestContext";

@Resolver(() => UserRequest)
export class UserRequestResolver {
  @FieldResolver(() => User)
  async user(@Ctx() { loaders }: RequestContext, @Root() { user }: UserRequest): Promise<User> {
    return loaders.userLoader.load(user as any);
  }
}
