import { Resolver, Query, Authorized, Args, Mutation, Arg, Ctx } from "type-graphql";
import { ValidationError } from "apollo-server-express";

import { Roles } from "@api/modules/utils/auth";
import { PaginatedUserResponse } from "@api/modules/types/PaginatedResponse";
import { User } from "@api/entity/User";
import { FilterArgs } from "@api/modules/types/FilterArgs";
import { UserService } from "@api/modules/user/user/User.service";
import { UpdateProfileInput } from "@api/modules/user/user/UpdateProfileInput";
import { SessionInfo } from "@api/modules/user/user/SessionInfo";
import { SendVerificationCodeInput } from "@api/modules/user/user/SendVerificationCodeInput";
import { RequestContext } from "@api/modules/types/RequestContext";
import { RegisterInput } from "@api/modules/user/user/RegisterInput";
import { LoginResponse } from "@api/modules/types/LoginResponse";
import { LoginInput } from "@api/modules/user/user/LoginInput";
import { VerificationInput } from "@api/modules/user/user/VerficationCodeInput";
import { UpdatePasswordInput } from "@api/modules/user/user/UpdatePasswordInput";
import { isPhoneAlreadyExist } from "@api/modules/user/user/isPhoneAlreadyExist";
import { normalizePhone } from "@api/modules/utils/normalizePhone";

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Authorized(Roles.User)
  @Query(() => User)
  me(@Ctx() { payload }: RequestContext): Promise<User> {
    return User.findOne(payload!.userId).then((user) => user!);
  }

  @Authorized(Roles.Admin)
  @Query(() => PaginatedUserResponse)
  users(@Args() args: FilterArgs): Promise<PaginatedUserResponse> {
    return this.userService.findAll(args);
  }

  @Authorized(Roles.User)
  @Mutation(() => Boolean)
  updateProfile(@Arg("data") data: UpdateProfileInput): Promise<boolean> {
    return this.userService.update(data);
  }

  @Mutation(() => SessionInfo)
  async sendVerificationCode(@Arg("data") data: SendVerificationCodeInput): Promise<SessionInfo> {
    const phoneNumber = normalizePhone(data.phoneNumber);

    if (await isPhoneAlreadyExist(phoneNumber)) {
      throw new ValidationError(`Phone number already in use`);
    }

    return await this.userService.sendVerficationCode({ ...data, phoneNumber });
  }

  @Mutation(() => SessionInfo)
  async forgotPassword(@Arg("data") data: SendVerificationCodeInput): Promise<SessionInfo> {
    const phoneNumber = normalizePhone(data.phoneNumber);

    const exist = await isPhoneAlreadyExist(phoneNumber);
    if (!exist) {
      throw new Error("No user found with this number");
    }

    return await this.userService.sendVerficationCode({ ...data, phoneNumber });
  }

  @Mutation(() => LoginResponse)
  async updatePassword(
    @Arg("data") { password, ...data }: UpdatePasswordInput,
    @Ctx() { res }: RequestContext
  ): Promise<LoginResponse> {
    const phone = await this.userService.verifyCode(data);

    const user = await User.findOne({ phone });
    if (!user) {
      throw new Error("No user found");
    }

    const samePassword = await user.validatePassword(password);
    if (samePassword) {
      throw new Error("Please use a new password");
    }

    // Update password
    user.password = password;
    await user.hashPassword();
    user.save();

    return await this.userService.login(res, { phone, password });
  }

  @Authorized(Roles.User)
  @Mutation(() => Boolean)
  async updatePhoneNumber(
    @Arg("data") data: VerificationInput,
    @Ctx() { payload }: RequestContext
  ): Promise<boolean> {
    const phone = await this.userService.verifyCode(data);
    return this.userService.update({ id: payload!.userId, phone });
  }

  @Mutation(() => User)
  register(@Arg("data") data: RegisterInput): Promise<User> {
    return this.userService.register(data);
  }

  @Mutation(() => LoginResponse)
  async login(@Arg("data") data: LoginInput, @Ctx() { res }: RequestContext): Promise<LoginResponse> {
    return this.userService.login(res, data);
  }
}
