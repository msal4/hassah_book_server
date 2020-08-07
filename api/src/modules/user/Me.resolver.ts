import { Resolver, Query, Ctx, Authorized } from "type-graphql";

import { RequestContext } from "@api/modules/shared/types/RequestContext";
import { User } from "@api/entity/User";
import { Roles } from "@api/modules/utils/auth";

@Resolver()
export class MeResolver {
  @Authorized(Roles.User)
  @Query(() => User, { nullable: true })
  me(@Ctx() { payload }: RequestContext): Promise<User | undefined> {
    return User.findOne(payload?.userId);
  }
}
