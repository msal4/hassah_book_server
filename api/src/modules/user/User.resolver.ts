import { Resolver, Root, FieldResolver, Args } from "type-graphql";

import { User } from "@api/entity/User";
import { UserRequest } from "@api/entity/UserRequest";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { Favorite } from "@api/entity/Favorite";

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => [UserRequest])
  requests(@Root() user: User, @Args() { skip, take }: PagniationArgs) {
    return UserRequest.find({ where: { user }, skip, take });
  }

  @FieldResolver(() => [Favorite])
  favorites(@Root() user: User, @Args() { skip, take }: PagniationArgs) {
    return Favorite.find({ where: { user }, skip, take });
  }
}
