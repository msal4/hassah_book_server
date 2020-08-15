import { Service } from "typedi";
import { ValidationError } from "apollo-server-express";
import { Response } from "express";

import { BaseService } from "@api/modules/shared/services/Base.service";
import { User } from "@api/entity/User";
import { normalizePhone } from "@api/modules/utils/normalizePhone";
import { isPhoneAlreadyExist } from "@api/modules/user/user/isPhoneAlreadyExist";
import {
  relyingparty,
  sendRefreshTokenCookie,
  createRefreshToken,
  createAccessToken,
} from "@api/modules/utils/auth";
import { PhoneSessionInfo } from "@api/entity/PhoneSessionInfo";
import { SendVerificationCodeInput } from "@api/modules/user/user/SendVerificationCodeInput";
import { RegisterInput } from "@api/modules/user/user/RegisterInput";
import { LoginInput } from "@api/modules/user/user/LoginInput";
import { LoginResponse } from "@api/modules/shared/types/LoginResponse";
import { VerificationInput } from "@api/modules/user/user/VerficationCodeInput";

@Service()
export class UserService extends BaseService<User> {
  async sendVerficationCode(data: SendVerificationCodeInput) {
    const phoneNumber = normalizePhone(data.phoneNumber);

    if (await isPhoneAlreadyExist(phoneNumber)) {
      throw new ValidationError(`Phone number already in use`);
    }

    const response = await relyingparty.sendVerificationCode({
      phoneNumber,
      recaptchaToken: data.recaptchaToken,
    } as any);

    if (response.status !== 200) {
      throw new Error("Something went wrong while sending verification code!");
    }

    const sessionInfo = response.data.sessionInfo!;

    await PhoneSessionInfo.create({ phoneNumber, sessionInfo }).save();

    return { sessionInfo };
  }

  async verifyCode({ code, sessionInfo }: VerificationInput): Promise<string> {
    const session = await PhoneSessionInfo.findOne({ where: { sessionInfo } });
    if (!session) {
      throw new Error("No session found!");
    }

    if (await isPhoneAlreadyExist(session.phoneNumber)) {
      throw new ValidationError("Phone number already in use");
    }

    const response = await relyingparty.verifyPhoneNumber({ code, sessionInfo } as any);

    if (response.status !== 200) {
      throw new Error("Invalid verification code or session!");
    }

    return response.data.phoneNumber!;
  }

  async register(data: RegisterInput): Promise<User> {
    const phone = await this.verifyCode(data);
    return await User.create({ ...data, phone }).save();
  }

  async login(res: Response, data: LoginInput): Promise<LoginResponse> {
    const phone = normalizePhone(data.phone);
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      throw new Error("No user found");
    }

    const valid = await user.validatePassword(data.password);
    if (!valid) {
      throw new Error("Password is incorrect");
    }

    sendRefreshTokenCookie(res, createRefreshToken(user));

    return { accessToken: createAccessToken(user) };
  }
}
