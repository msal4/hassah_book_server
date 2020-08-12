import { Resolver, Args, Query, Mutation, Arg, Authorized } from "type-graphql";

import { FilterArgs } from "@api/modules/shared/types/FilterArgs";
import { Product } from "@api/entity/Product";
import { PaginatedProductResponse } from "@api/modules/shared/types/PaginatedResponse";
import { ProductService } from "@api/modules/product/product/Product.service";
import { CreateProductInput } from "@api/modules/product/product/CreateProductInput";
import { UpdateProductInput } from "@api/modules/product/product/UpdateProductInput";
import { Roles } from "@api/modules/utils/auth";

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => PaginatedProductResponse)
  async products(@Args() args: FilterArgs): Promise<PaginatedProductResponse> {
    return this.productService.findAll(args);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Product)
  createProduct(@Arg("data") data: CreateProductInput): Promise<Product> {
    return this.productService.create(data);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  updateProduct(@Arg("data") data: UpdateProductInput): Promise<boolean> {
    return this.productService.update(data);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  deleteProduct(@Arg("id") id: string): Promise<boolean> {
    return this.productService.delete(id);
  }
}
