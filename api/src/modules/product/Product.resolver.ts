import { Resolver, Args, Query, Mutation, Arg } from "type-graphql";
import { Service } from "typedi";

import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { Product } from "@api/entity/Product";
import { PaginatedProductResponse } from "@api/modules/shared/types/PaginatedResponse";
import { ProductService } from "@api/modules/services/Product.service";
import { CreateProductInput } from "@api/modules/product/product/CreateProductInput";
import { UpdateProductInput } from "@api/modules/product/product/UpdateProductInput";

@Service()
@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => PaginatedProductResponse)
  products(@Args() args: PagniationArgs): Promise<PaginatedProductResponse> {
    return this.productService.findAll(args);
  }

  @Mutation(() => Product)
  createProduct(@Arg("data") data: CreateProductInput): Promise<Product> {
    return this.productService.create(data);
  }

  @Mutation(() => Boolean)
  updateProduct(@Arg("data") data: UpdateProductInput): Promise<boolean> {
    return this.productService.update(data);
  }

  @Mutation(() => Boolean)
  deleteProduct(@Arg("id") id: string): Promise<boolean> {
    return this.productService.delete(id);
  }
}
