import { Resolver, Query, Args, Mutation, Arg } from "type-graphql";
import { Service } from "typedi";

import { CategoryService } from "@api/modules/services/Category.service";
import { PaginatedCategoryResponse } from "@api/shared/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/PaginationArgs";
import { Category } from "@api/entity/Category";
import { CreateCategoryInput } from "@api/modules/category/category/CreateCategoryInput";
import { UpdateCategoryInput } from "@api/modules/category/category/UpdateCategoryInput";

@Service()
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
    return this.categoryService.update(data.id, data);
  }
}
