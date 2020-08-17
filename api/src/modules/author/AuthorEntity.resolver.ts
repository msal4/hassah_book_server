import { Resolver, FieldResolver, Root, Args } from "type-graphql";

import { Author } from "@api/entity/Author";
import { FilterArgs } from "@api/modules/types/FilterArgs";
import { PaginatedProductResponse } from "@api/modules/types/PaginatedResponse";
import { ProductService } from "@api/modules/product/product/Product.service";
import { PAGINATED_RESPONSE_COMPLEXITY } from "@api/modules/constants/query";

@Resolver(() => Author)
export class AuthorEntityResolver {
  constructor(private readonly productService: ProductService) {}

  @FieldResolver(() => PaginatedProductResponse, { complexity: PAGINATED_RESPONSE_COMPLEXITY })
  products(@Root() author: Author, @Args() args: FilterArgs): Promise<PaginatedProductResponse> {
    return this.productService.findAll({ where: { author }, ...args });
  }
}
