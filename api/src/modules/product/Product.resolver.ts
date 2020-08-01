import { Resolver, Args, Query } from "type-graphql";
import { Service } from "typedi";

import { PagniationArgs } from "@api/modules/shared/PaginationArgs";
import { PaginatedProductResponse } from "@api/shared/PaginatedResponse";
import { ProductRepository } from "@api/modules/repositories/ProductRepository";

@Service()
@Resolver()
export class ProductResolver {
  constructor(private readonly productRepository: ProductRepository) {}

  @Query(() => PaginatedProductResponse)
  async products(
    @Args() args: PagniationArgs
  ): Promise<PaginatedProductResponse> {
    return await this.productRepository.findAll(args);
  }
}
