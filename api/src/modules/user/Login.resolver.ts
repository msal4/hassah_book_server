import { Resolver, Mutation, Arg, ObjectType, Field, Ctx } from "type-graphql";
import { compare } from "bcryptjs";

import { LoginInput } from "@api/modules/user/login/LoginInput";
import { normalizePhone } from "@api/modules/utils/normalizePhone";
import { User } from "@api/entity/User";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshTokenCookie,
} from "./auth";
import { ApiContext } from "../types/ApiContext";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class LoginReslover {
  @Mutation(_returns => LoginResponse)
  async login(
    @Arg("data") data: LoginInput,
    @Ctx() { res }: ApiContext
  ): Promise<LoginResponse> {
    // Find a user
    const phone = normalizePhone(data.phone);
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      throw new Error("no user found");
    }

    // Validate password
    const valid = await compare(data.password, user.password);
    if (!valid) {
      throw new Error("password is incorrect");
    }

    sendRefreshTokenCookie(res, createRefreshToken(user));

    return { accessToken: createAccessToken(user) };
  }
}
