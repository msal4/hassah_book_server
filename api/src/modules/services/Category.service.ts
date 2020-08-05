import { Service } from "typedi";

import { Category } from "@api/entity/Category";
import { PaginatedCategoryResponse, PaginatedProductResponse } from "@api/shared/PaginatedResponse";
import { FindAllOptions } from "@api/modules/types/FindAllOptions";
import { PagniationArgs } from "@api/modules/shared/PaginationArgs";

@Service()
export class CategoryService {
  async findProducts(categoryId: string, { skip, take }: PagniationArgs): Promise<PaginatedProductResponse> {
    // since typeorm does not handle pagination for relations I have to write the query myself.
    // It should be resolved soon but for now this will do the trick.
    // issue: https://github.com/typeorm/typeorm/issues/5392
    const category = await Category.createQueryBuilder("category")
      .loadRelationCountAndMap("category.totalProducts", "category.products")
      .innerJoinAndSelect("category.products", "categoryProduct", "category.id = :categoryId", {
        categoryId,
      })
      .offset(skip)
      .limit(take)
      .getOne();

    if (!category) {
      return { items: [], total: 0, hasMore: false };
    }

    // products do not actually return a promise but since I defined it as Lazy in the entity
    // It is treated as such. This is related to the relation pagination issue mentioned above.
    const items = await category.products;

    return { items, total: category.totalProducts!, hasMore: skip + take < category.totalProducts! };
  }

  async findAll(options?: FindAllOptions<Category>): Promise<PaginatedCategoryResponse> {
    const [items, total] = await Category.findAndCount(options);
    return { items, total, hasMore: options!.skip + options!.take < total };
  }

  async delete(id: string): Promise<boolean> {
    try {
      await Category.delete(id);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
