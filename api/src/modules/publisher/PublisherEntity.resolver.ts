import { Resolver, FieldResolver, Root, Args } from "type-graphql";
import { Service } from "typedi";

import { Publisher } from "@api/entity/Publisher";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { PaginatedProductResponse } from "@api/modules/shared/types/PaginatedResponse";
import { ProductService } from "@api/modules/product/product/Product.service";

@Service()
@Resolver(() => Publisher)
export class PublisherEntityResolver {
  constructor(private readonly productService: ProductService) {}

  @FieldResolver(() => PaginatedProductResponse)
  products(
    @Root() publisher: Publisher,
    @Args() { skip, take }: PagniationArgs
  ): Promise<PaginatedProductResponse> {
    return this.productService.findAll({ where: { publisher: publisher }, skip, take });
  }
}
