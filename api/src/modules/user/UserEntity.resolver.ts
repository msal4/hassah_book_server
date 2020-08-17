import { Resolver, Root, FieldResolver, Args, Authorized } from "type-graphql";

import { User } from "@api/entity/User";
import { FilterArgs } from "@api/modules/types/FilterArgs";
import { UserRequestService } from "@api/modules/user-request/user-request/UserRequest.service";
import { FavoriteService } from "@api/modules/favorite/favorite/Favorite.service";
import {
  PaginatedUserRequestResponse,
  PaginatedFavoriteResponse,
  PaginatedOrderResponse,
} from "@api/modules/types/PaginatedResponse";
import { OrderService } from "@api/modules/order/order/Order.service";
import { Roles } from "@api/modules/utils/auth";
import { PAGINATED_RESPONSE_COMPLEXITY } from "@api/modules/constants/query";

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userRequestService: UserRequestService,
    private readonly favoriteService: FavoriteService,
    private readonly orderService: OrderService
  ) {}

  @Authorized(Roles.Owner, Roles.Admin)
  @FieldResolver(() => PaginatedUserRequestResponse, { complexity: PAGINATED_RESPONSE_COMPLEXITY })
  requests(@Root() user: User, @Args() args: FilterArgs): Promise<PaginatedUserRequestResponse> {
    return this.userRequestService.findAll({ where: { user }, ...args });
  }

  @Authorized(Roles.Owner, Roles.Admin)
  @FieldResolver(() => PaginatedFavoriteResponse, { complexity: PAGINATED_RESPONSE_COMPLEXITY })
  favorites(@Root() user: User, @Args() args: FilterArgs): Promise<PaginatedFavoriteResponse> {
    return this.favoriteService.findAll({ where: { user }, ...args });
  }

  @Authorized(Roles.Owner, Roles.Admin)
  @FieldResolver(() => PaginatedOrderResponse, { complexity: PAGINATED_RESPONSE_COMPLEXITY })
  orders(@Root() user: User, @Args() args: FilterArgs): Promise<PaginatedOrderResponse> {
    return this.orderService.findAll({ where: { user }, ...args });
  }
}
