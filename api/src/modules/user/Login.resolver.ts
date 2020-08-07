import { Resolver, Mutation, Arg, Ctx } from "type-graphql";

import { LoginInput } from "@api/modules/user/login/LoginInput";
import { normalizePhone } from "@api/modules/utils/normalizePhone";
import { User } from "@api/entity/User";
import { createAccessToken, createRefreshToken, sendRefreshTokenCookie } from "@api/modules/utils/auth";
import { RequestContext } from "@api/modules/shared/types/RequestContext";
import { LoginResponse } from "@api/modules/shared/types/LoginResponse";

@Resolver()
export class LoginReslover {
  @Mutation((_returns) => LoginResponse)
  async login(@Arg("data") data: LoginInput, @Ctx() { res }: RequestContext): Promise<LoginResponse> {
    // Find a user
    const phone = normalizePhone(data.phone);
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      throw new Error("no user found");
    }

    // Verify password
    const valid = await user.validatePassword(data.password);
    if (!valid) {
      throw new Error("password is incorrect");
    }

    sendRefreshTokenCookie(res, createRefreshToken(user));

    return { accessToken: createAccessToken(user) };
  }
}
