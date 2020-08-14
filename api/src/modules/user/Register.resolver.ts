import { Mutation, Arg } from "type-graphql";

import { ValidationError } from "apollo-server-express";

import { User } from "@api/entity/User";
import { RegisterInput } from "@api/modules/user/register/RegisterInput";
import { isPhoneAlreadyExist } from "@api/modules/user/register/isPhoneAlreadyExist";
import { PhoneSessionInfo } from "@api/entity/PhoneSessionInfo";
import { relyingparty } from "@api/modules/utils/auth";

export class RegisterResolver {
  @Mutation(() => User)
  async register(@Arg("data") { sessionInfo, code, name, password, address }: RegisterInput): Promise<User> {
    const session = await PhoneSessionInfo.findOne({ where: { sessionInfo } });
    if (!session) {
      throw new Error("No session found!");
    }

    if (await isPhoneAlreadyExist(session.phoneNumber)) {
      throw new ValidationError(`phone number already in use`);
    }

    const response = await relyingparty.verifyPhoneNumber({ code, sessionInfo } as any);

    if (response.status !== 200) {
      throw new Error("Invalid verification code or session!");
    }

    return await User.create({ phone: session.phoneNumber, name, password, address }).save();
  }
}
