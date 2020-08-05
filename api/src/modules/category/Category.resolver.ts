import { Resolver, Query, Args } from "type-graphql";
import { Service } from "typedi";

import { CategoryService } from "@api/modules/services/Category.service";
import { PaginatedCategoryResponse } from "@api/shared/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/PaginationArgs";

@Service()
@Resolver()
export class CategoryResolver {
  constructor(private readonly service: CategoryService) {}
  @Query(() => PaginatedCategoryResponse)
  categories(@Args() args: PagniationArgs): Promise<PaginatedCategoryResponse> {
    return this.service.findAll(args);
  }
}
