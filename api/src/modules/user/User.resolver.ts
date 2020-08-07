import { Resolver, Query, Authorized, Args } from "type-graphql";

import { Roles } from "@api/modules/utils/auth";
import { PaginatedUserResponse } from "@api/modules/shared/types/PaginatedResponse";
import { User } from "@api/entity/User";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { hasMore } from "@api/modules/utils/hasMore";

@Resolver()
export class UserResolver {
  @Authorized(Roles.Admin)
  @Query(() => PaginatedUserResponse)
  async users(@Args() args: PagniationArgs): Promise<PaginatedUserResponse> {
    const [items, total] = await User.findAndCount(args);
    return { items, total, hasMore: hasMore(args, total) };
  }
}
