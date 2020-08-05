import { Resolver, FieldResolver, Root, Args } from "type-graphql";
import { Service } from "typedi";

import { Category } from "@api/entity/Category";
import { PagniationArgs } from "@api/modules/shared/PaginationArgs";
import { PaginatedProductResponse } from "@api/shared/PaginatedResponse";
import { CategoryService } from "@api/modules/services/Category.service";

@Service()
@Resolver(() => Category)
export class CategoryEntityResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @FieldResolver(() => PaginatedProductResponse)
  products(@Root() category: Category, @Args() args: PagniationArgs): Promise<PaginatedProductResponse> {
    return this.categoryService.findProducts(category.id, args);
  }
}
