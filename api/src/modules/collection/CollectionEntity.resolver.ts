import { Resolver, FieldResolver, Root, Args } from "type-graphql";

import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { PaginatedProductResponse } from "@api/modules/shared/types/PaginatedResponse";
import { Collection } from "@api/entity/Collection";
import { BaseService } from "@api/modules/shared/services/Base.service";
import { Product } from "@api/entity/Product";
import { ProductService } from "@api/modules/product/product/Product.service";

@Resolver(() => Collection)
export class CollectionEntityResolver {
  constructor(private readonly productService: ProductService) {}

  @FieldResolver(() => PaginatedProductResponse)
  products(
    @Root() { id }: Collection,
    @Args() paginationArgs: PagniationArgs
  ): Promise<PaginatedProductResponse> {
    return BaseService.findManyToMany(Product, {
      parentId: id,
      relationName: "collections",
      relations: this.productService.relations,
      paginationArgs,
    });
  }
}
