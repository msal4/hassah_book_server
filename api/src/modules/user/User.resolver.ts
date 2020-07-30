import { Resolver, Root, FieldResolver, Args } from "type-graphql";

import { User } from "@api/entity/User";
import { UserRequest } from "@api/entity/UserRequest";
import { PagniationArgs } from "../shared/PaginationArgs";

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => [UserRequest])
  requests(@Root() parent: User, @Args() { skip, take }: PagniationArgs) {
    return UserRequest.find({ where: { user: parent }, skip, take });
  }
}
