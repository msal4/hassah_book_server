import { Resolver, FieldResolver, Root, Args } from "type-graphql";

import { Category } from "@api/entity/Category";
import { FilterArgs } from "@api/modules/types/FilterArgs";
import { PaginatedProductResponse } from "@api/modules/types/PaginatedResponse";
import { BaseService } from "@api/modules/services/Base.service";
import { Product } from "@api/entity/Product";
import { ProductService } from "@api/modules/product/product/Product.service";
import { PAGINATED_RESPONSE_COMPLEXITY } from "@api/modules/constants/query";

@Resolver(() => Category)
export class CategoryEntityResolver {
  constructor(private readonly productService: ProductService) {}

  @FieldResolver(() => PaginatedProductResponse, { complexity: PAGINATED_RESPONSE_COMPLEXITY })
  products(@Root() { id }: Category, @Args() paginationArgs: FilterArgs): Promise<PaginatedProductResponse> {
    return BaseService.findManyToMany(Product, {
      childId: id,
      relationName: "categories",
      relations: this.productService.relations,
      filterArgs: paginationArgs,
    });
  }
}
