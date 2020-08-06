import { Resolver, Query, Args, Mutation, Arg } from "type-graphql";

import { CategoryService } from "@api/modules/category/category/Category.service";
import { PaginatedCategoryResponse } from "@api/modules/shared/types/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { CreateCategoryInput } from "@api/modules/category/category/CreateCategoryInput";
import { UpdateCategoryInput } from "@api/modules/category/category/UpdateCategoryInput";
import { Category } from "@api/entity/Category";

@Resolver()
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => PaginatedCategoryResponse)
  categories(@Args() args: PagniationArgs): Promise<PaginatedCategoryResponse> {
    return this.categoryService.findAll(args);
  }

  @Mutation(() => Category)
  createCategory(@Arg("data") data: CreateCategoryInput): Promise<Category> {
    return this.categoryService.create(data);
  }

  @Mutation(() => Boolean)
  updateCategory(@Arg("data") data: UpdateCategoryInput): Promise<boolean> {
    return this.categoryService.update(data);
  }
}
