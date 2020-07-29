import { Resolver, Query, UseMiddleware, Ctx } from "type-graphql";

import { isAuth } from "@api/modules/middlewares/isAuth";
import { ApiContext } from "@api/modules/types/ApiContext";
import { User } from "@api/entity/User";

@Resolver()
export class MeResolver {
  @Query(() => User)
  @UseMiddleware(isAuth)
  me(@Ctx() { payload }: ApiContext): Promise<User | undefined> {
    return User.findOne(payload?.userId);
  }
}
