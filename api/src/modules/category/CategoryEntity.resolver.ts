import { Resolver, FieldResolver, Root, Args } from "type-graphql";

import { Category } from "@api/entity/Category";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { PaginatedProductResponse } from "@api/modules/shared/types/PaginatedResponse";
import { CategoryService } from "@api/modules/category/category/Category.service";

@Resolver(() => Category)
export class CategoryEntityResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @FieldResolver(() => PaginatedProductResponse)
  products(
    @Root() { id }: Category,
    @Args() paginationArgs: PagniationArgs
  ): Promise<PaginatedProductResponse> {
    return this.categoryService.findManyToMany({ parentId: id, relationName: "products", paginationArgs });
  }
}
