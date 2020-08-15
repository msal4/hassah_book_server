import { Resolver, Query, Authorized, Args, Mutation, Arg, Ctx } from "type-graphql";

import { Roles } from "@api/modules/utils/auth";
import { PaginatedUserResponse } from "@api/modules/shared/types/PaginatedResponse";
import { User } from "@api/entity/User";
import { FilterArgs } from "@api/modules/shared/types/FilterArgs";
import { UserService } from "@api/modules/user/user/User.service";
import { UpdateProfileInput } from "@api/modules/user/user/UpdateProfileInput";
import { SessionInfo } from "@api/modules/user/user/SessionInfo";
import { SendVerificationCodeInput } from "@api/modules/user/user/SendVerificationCodeInput";
import { RequestContext } from "@api/modules/shared/types/RequestContext";
import { RegisterInput } from "@api/modules/user/user/RegisterInput";
import { LoginResponse } from "@api/modules/shared/types/LoginResponse";
import { LoginInput } from "@api/modules/user/user/LoginInput";
import { VerificationInput } from "@api/modules/user/user/VerficationCodeInput";

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
  sendVerificationCode(@Arg("data") data: SendVerificationCodeInput): Promise<SessionInfo> {
    return this.userService.sendVerficationCode(data);
  }

  @Authorized(Roles.User)
  @Mutation(() => Boolean)
  async updatePhoneNumber(
    @Arg("data") data: VerificationInput,
    @Ctx() { payload }: RequestContext
  ): Promise<boolean> {
    const phone = await this.userService.verifyCode(data);
    const user = await User.findOne({ id: payload!.userId });
    return this.userService.update({ id: user!.id, phone });
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
