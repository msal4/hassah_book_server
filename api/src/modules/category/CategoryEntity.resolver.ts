import { Resolver, FieldResolver, Root, Args } from "type-graphql";

import { Category } from "@api/entity/Category";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { PaginatedProductResponse } from "@api/modules/shared/types/PaginatedResponse";
import { BaseService } from "@api/modules/shared/services/Base.service";
import { Product } from "@api/entity/Product";
import { ProductService } from "@api/modules/product/product/Product.service";

@Resolver(() => Category)
export class CategoryEntityResolver {
  constructor(private readonly productService: ProductService) {}

  @FieldResolver(() => PaginatedProductResponse)
  products(
    @Root() { id }: Category,
    @Args() paginationArgs: PagniationArgs
  ): Promise<PaginatedProductResponse> {
    return BaseService.findManyToMany(Product, {
      parentId: id,
      relationName: "categories",
      relations: this.productService.relations,
      paginationArgs,
    });
  }
}
