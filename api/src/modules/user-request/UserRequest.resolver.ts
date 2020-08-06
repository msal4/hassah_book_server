import { Resolver, Query, Ctx, Args, UseMiddleware, Mutation, Arg } from "type-graphql";

import { PaginatedUserRequestResponse } from "@api/modules/shared/types/PaginatedResponse";
import { UserRequestService } from "@api/modules/user-request/user-request/UserRequest.service";
import { RequestContext } from "@api/modules/shared/types/RequestContext";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { isAuth } from "@api/modules/middleware/isAuth";
import { UserRequest } from "@api/entity/UserRequest";
import { CreateUserRequestInput } from "@api/modules/user-request/user-request/CreateUserRequestInput";

@Resolver()
export class UserRequestResolver {
  constructor(private readonly userRequestService: UserRequestService) {}
  // TODO: add authorization. Only an admin can query all requests.
  @Query(() => PaginatedUserRequestResponse)
  requests(@Args() { skip, take }: PagniationArgs): Promise<PaginatedUserRequestResponse> {
    return this.userRequestService.findAll({ skip, take });
  }

  @Query(() => PaginatedUserRequestResponse)
  @UseMiddleware(isAuth)
  myRequests(
    @Ctx() { payload }: RequestContext,
    @Args() { skip, take }: PagniationArgs
  ): Promise<PaginatedUserRequestResponse> {
    return this.userRequestService.findAll({ where: { user: { id: payload!.userId } }, skip, take });
  }

  @Mutation(() => UserRequest)
  @UseMiddleware(isAuth)
  createRequest(
    @Ctx() { payload }: RequestContext,
    @Arg("data") data: CreateUserRequestInput
  ): Promise<UserRequest> {
    return this.userRequestService.create({ ...data, user: { id: payload!.userId } });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async removeRequest(
    @Ctx() { payload }: RequestContext,
    @Arg("requestId") requestId: string
  ): Promise<boolean> {
    if (!payload?.userId) {
      return false;
    }
    return await this.userRequestService.delete(requestId);
  }
}
