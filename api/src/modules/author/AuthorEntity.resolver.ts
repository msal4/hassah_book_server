import { Resolver, FieldResolver, Root, Args } from "type-graphql";
import { Service } from "typedi";

import { Author } from "@api/entity/Author";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { PaginatedProductResponse } from "@api/modules/shared/types/PaginatedResponse";
import { ProductService } from "@api/modules/product/product/Product.service";

@Service()
@Resolver(() => Author)
export class AuthorEntityResolver {
  constructor(private readonly productService: ProductService) {}

  @FieldResolver(() => PaginatedProductResponse)
  products(
    @Root() author: Author,
    @Args() { skip, take }: PagniationArgs
  ): Promise<PaginatedProductResponse> {
    return this.productService.findAll({ where: { author }, skip, take });
  }
}
