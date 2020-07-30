import { Mutation, Arg } from "type-graphql";

import { ValidationError } from "apollo-server-express";

import { User } from "@api/entity/User";
import { RegisterInput } from "@api/modules/user/register/RegisterInput";
import { isPhoneAlreadyExist } from "@api/modules/user/register/isPhoneAlreadyExist";
import { normalizePhone } from "@api/modules/utils/normalizePhone";

export class RegisterResolver {
  // TODO: implement phone number verification.
  @Mutation(_returns => User)
  async register(@Arg("data") data: RegisterInput): Promise<User> {
    const phone = normalizePhone(data.phone);

    if (await isPhoneAlreadyExist(phone)) {
      throw new ValidationError(`phone number already in use`);
    }

    return await User.create({ ...data, phone }).save();
  }
}
