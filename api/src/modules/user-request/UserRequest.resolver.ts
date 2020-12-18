import { Resolver, Query, Ctx, Args, Mutation, Arg, Authorized } from "type-graphql";

import { PaginatedUserRequestResponse } from "@api/modules/types/PaginatedResponse";
import { UserRequestService } from "@api/modules/user-request/user-request/UserRequest.service";
import { RequestContext } from "@api/modules/types/RequestContext";
import { FilterArgs } from "@api/modules/types/FilterArgs";
import { UserRequest } from "@api/entity/UserRequest";
import { CreateUserRequestInput } from "@api/modules/user-request/user-request/CreateUserRequestInput";
import { UpdateUserRequestInput } from "@api/modules/user-request/user-request/UpdateUserRequestInput";
import { Roles } from "@api/modules/utils/auth";

@Resolver()
export class UserRequestResolver {
  constructor(private readonly userRequestService: UserRequestService) {}

  @Authorized(Roles.Admin)
  @Query(() => PaginatedUserRequestResponse)
  requests(@Args() args: FilterArgs): Promise<PaginatedUserRequestResponse> {
    return this.userRequestService.findAll(args);
  }

  @Authorized(Roles.User)
  @Query(() => PaginatedUserRequestResponse)
  myRequests(
    @Ctx() { payload }: RequestContext,
    @Args() args: FilterArgs
  ): Promise<PaginatedUserRequestResponse> {
    return this.userRequestService.findAll({ where: { user: { id: payload!.userId } }, ...args });
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
  removeRequest(@Arg("requestId") requestId: string): Promise<boolean> {
    return this.userRequestService.delete(requestId);
  }
}
