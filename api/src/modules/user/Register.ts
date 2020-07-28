import { Mutation, Arg } from "type-graphql";
import { hash } from "bcryptjs";
import { ValidationError } from "apollo-server-express";

import { User } from "src/entity/User";
import { RegisterInput } from "src/modules/user/register/RegisterInput";
import { isPhoneAlreadyExist } from "src/modules/user/register/isPhoneAlreadyExist";
import { normalizePhone } from "src/modules/utils/normalizePhone";

export class RegisterResolver {
  // TODO: implement phone number verification.
  @Mutation(_returns => User)
  async register(@Arg("data") data: RegisterInput): Promise<User> {
    const phone = normalizePhone(data.phone);

    if (await isPhoneAlreadyExist(phone)) {
      throw new ValidationError(`phone number already in use`);
    }

    const SALT = Number(process.env.PASSWORD_SALT!);
    const password = await hash(data.password, SALT);

    return await User.create({ ...data, phone, password }).save();
  }
}
