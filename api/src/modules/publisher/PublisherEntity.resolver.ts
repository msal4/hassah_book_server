import { Resolver, FieldResolver, Root, Args } from "type-graphql";

import { Publisher } from "@api/entity/Publisher";
import { FilterArgs } from "@api/modules/types/FilterArgs";
import { PaginatedProductResponse } from "@api/modules/types/PaginatedResponse";
import { ProductService } from "@api/modules/product/product/Product.service";

@Resolver(() => Publisher)
export class PublisherEntityResolver {
  constructor(private readonly productService: ProductService) {}

  @FieldResolver(() => PaginatedProductResponse)
  products(@Root() publisher: Publisher, @Args() args: FilterArgs): Promise<PaginatedProductResponse> {
    return this.productService.findAll({ where: { publisher }, ...args });
  }
}
