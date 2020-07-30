import { Resolver, Root, FieldResolver, Args } from "type-graphql";

import { User } from "@api/entity/User";
import { UserRequest } from "@api/entity/UserRequest";
import { PagniationArgs } from "@api/modules/shared/PaginationArgs";
import { Product } from "@api/entity/Product";

@Resolver(() => Product)
export class ProductResolver {
  @FieldResolver(() => [UserRequest])
  requests(@Root() parent: User, @Args() { skip, take }: PagniationArgs) {
    return UserRequest.find({ where: { user: parent }, skip, take });
  }
}
