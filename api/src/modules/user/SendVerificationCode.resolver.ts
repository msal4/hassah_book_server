import { Mutation, Arg } from "type-graphql";

import { ValidationError } from "apollo-server-express";

import { isPhoneAlreadyExist } from "@api/modules/user/register/isPhoneAlreadyExist";
import { normalizePhone } from "@api/modules/utils/normalizePhone";
import { SendVerificationCodeInput } from "@api/modules/user/send-verification-code/SendVerificationCodeInput";
import { relyingparty } from "@api/modules/utils/auth";
import { SessionInfo } from "@api/modules/user/send-verification-code/SessionInfo";
import { PhoneSessionInfo } from "@api/entity/PhoneSessionInfo";

export class SendVerificationCodeResolver {
  @Mutation(() => SessionInfo)
  async sendVerificationCode(@Arg("data") data: SendVerificationCodeInput): Promise<SessionInfo> {
    const phoneNumber = normalizePhone(data.phoneNumber);

    if (await isPhoneAlreadyExist(phoneNumber)) {
      throw new ValidationError(`phone number already in use`);
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
}
