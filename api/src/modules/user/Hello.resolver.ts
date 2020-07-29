import { Query, Resolver, UseMiddleware, Ctx, Mutation } from "type-graphql";
import { getConnection } from "typeorm";

import { isAuth } from "@api/modules/middlewares/isAuth";
import { ApiContext } from "@api/modules/types/ApiContext";
import { User } from "@api/entity/User";

// This file is for testing purposes only
// TODO: remove this file
@Resolver()
export class HelloResover {
  @Query(() => String)
  async helloWorld() {
    return "Hello, world!";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async byeWorld(@Ctx() context: ApiContext) {
    const id = context.payload?.userId;
    const user = await User.findOne(id);
    return `Hello, ${user?.name}!`;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async revokeRefreshToken(@Ctx() { payload }: ApiContext) {
    await getConnection()
      .getRepository(User)
      .increment({ id: payload?.userId }, "tokenVersion", 1);
    return true;
  }
}
