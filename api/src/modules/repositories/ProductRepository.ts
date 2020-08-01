import { EntityRepository, Repository, FindManyOptions } from "typeorm";
import { Service } from "typedi";

import { Product } from "@api/entity/Product";
import { PaginatedProductResponse } from "@api/shared/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/PaginationArgs";

type Options = PagniationArgs & FindManyOptions<Product>;

@Service()
@EntityRepository()
export class ProductRepository extends Repository<Product> {
  async findAll(options: Options): Promise<PaginatedProductResponse> {
    const [items, total] = await Product.findAndCount(options);
    return { items, total, hasMore: options.skip + options.take < total };
  }
}
