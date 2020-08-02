import { Resolver, Query, UseMiddleware, Ctx } from "type-graphql";

import { isAuth } from "@api/modules/middleware/isAuth";
import { RequestContext } from "@api/modules/types/RequestContext";
import { User } from "@api/entity/User";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  me(@Ctx() { payload }: RequestContext): Promise<User | undefined> {
    return User.findOne(payload?.userId);
  }
}
