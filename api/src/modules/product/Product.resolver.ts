import { Resolver, Args, Query, Mutation, Arg, Authorized, ID } from "type-graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";

import { FilterArgs } from "@api/modules/types/FilterArgs";
import { Product } from "@api/entity/Product";
import { PaginatedProductResponse } from "@api/modules/types/PaginatedResponse";
import { ProductService } from "@api/modules/product/product/Product.service";
import { CreateProductInput } from "@api/modules/product/product/CreateProductInput";
import { UpdateProductInput } from "@api/modules/product/product/UpdateProductInput";
import { Roles } from "@api/modules/utils/auth";

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => PaginatedProductResponse)
  products(@Args() args: FilterArgs): Promise<PaginatedProductResponse> {
    return this.productService.findAll(args);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Product)
  async createProduct(
    @Arg("data") data: CreateProductInput,
    @Arg("imageFile", () => GraphQLUpload) imageFile: Promise<FileUpload>
  ): Promise<Product> {
    return await this.productService.create(data, await imageFile);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  async updateProduct(
    @Arg("data") data: UpdateProductInput,
    @Arg("imageFile", () => GraphQLUpload, { nullable: true }) imageFile?: Promise<FileUpload>
  ): Promise<boolean> {
    return await this.productService.update(data, await imageFile);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  deleteProduct(@Arg("id", () => ID) id: string): Promise<boolean> {
    return this.productService.delete(id);
  }
}
