import { Resolver, Query, Args, Mutation, Arg, Authorized, ID } from "type-graphql";

import { CategoryService } from "@api/modules/category/category/Category.service";
import { PaginatedCategoryResponse } from "@api/modules/types/PaginatedResponse";
import { FilterArgs } from "@api/modules/types/FilterArgs";
import { CreateCategoryInput } from "@api/modules/category/category/CreateCategoryInput";
import { UpdateCategoryInput } from "@api/modules/category/category/UpdateCategoryInput";
import { Category } from "@api/entity/Category";
import { Roles } from "@api/modules/utils/auth";

@Resolver()
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => Category, { nullable: true })
  category(@Arg("id", () => ID) id: string): Promise<Category | null> {
    return this.categoryService.findOne({ where: { id } });
  }

  @Query(() => PaginatedCategoryResponse)
  categories(@Args() args: FilterArgs): Promise<PaginatedCategoryResponse> {
    return this.categoryService.findAll(args);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Category)
  createCategory(@Arg("data") data: CreateCategoryInput): Promise<Category> {
    return this.categoryService.create(data);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  updateCategory(@Arg("data") data: UpdateCategoryInput): Promise<boolean> {
    return this.categoryService.update(data);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  deleteCategory(@Arg("id", () => ID) id: string): Promise<boolean> {
    return this.categoryService.delete(id);
  }
}
