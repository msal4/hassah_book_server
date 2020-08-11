import { Resolver, Query, Authorized, Args } from "type-graphql";

import { Roles } from "@api/modules/utils/auth";
import { PaginatedUserResponse } from "@api/modules/shared/types/PaginatedResponse";
import { User } from "@api/entity/User";
import { FilterArgs } from "@api/modules/shared/types/FilterArgs";
import { hasMore } from "@api/modules/utils/hasMore";

@Resolver()
export class UserResolver {
  @Authorized(Roles.Admin)
  @Query(() => PaginatedUserResponse)
  async users(@Args() args: FilterArgs): Promise<PaginatedUserResponse> {
    const [items, total] = await User.findAndCount(args);
    return { items, total, hasMore: hasMore(args, total) };
  }
}
