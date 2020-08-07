import { Resolver, Query, Ctx, Args, Mutation, Arg, Authorized } from "type-graphql";

import { PaginatedUserRequestResponse } from "@api/modules/shared/types/PaginatedResponse";
import { UserRequestService } from "@api/modules/user-request/user-request/UserRequest.service";
import { RequestContext } from "@api/modules/shared/types/RequestContext";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { UserRequest } from "@api/entity/UserRequest";
import { CreateUserRequestInput } from "@api/modules/user-request/user-request/CreateUserRequestInput";
import { UpdateUserRequestInput } from "@api/modules/user-request/user-request/UpdateUserRequestInput";
import { Roles } from "@api/modules/utils/auth";

@Resolver()
export class UserRequestResolver {
  constructor(private readonly userRequestService: UserRequestService) {}

  @Authorized(Roles.Admin)
  @Query(() => PaginatedUserRequestResponse)
  requests(@Args() { skip, take }: PagniationArgs): Promise<PaginatedUserRequestResponse> {
    return this.userRequestService.findAll({ skip, take });
  }

  @Authorized(Roles.User)
  @Query(() => PaginatedUserRequestResponse)
  myRequests(
    @Ctx() { payload }: RequestContext,
    @Args() { skip, take }: PagniationArgs
  ): Promise<PaginatedUserRequestResponse> {
    return this.userRequestService.findAll({ where: { user: { id: payload!.userId } }, skip, take });
  }

  @Authorized(Roles.User)
  @Mutation(() => UserRequest)
  createRequest(
    @Ctx() { payload }: RequestContext,
    @Arg("data") data: CreateUserRequestInput
  ): Promise<UserRequest> {
    return this.userRequestService.create({ ...data, user: { id: payload!.userId } });
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  updateRequest(@Arg("data") data: UpdateUserRequestInput): Promise<boolean> {
    return this.userRequestService.update(data);
  }

  @Authorized(Roles.Admin, Roles.User)
  @Mutation(() => Boolean)
  async removeRequest(@Arg("requestId") requestId: string): Promise<boolean> {
    return await this.userRequestService.delete(requestId);
  }
}
