import { FindManyOptions } from "typeorm";
import { Service } from "typedi";

import { Product } from "@api/entity/Product";
import { PaginatedProductResponse } from "@api/shared/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/PaginationArgs";
import { CreateProductInput } from "@api/modules/product/product/CreateProductInput";
import { UpdateProductInput } from "@api/modules/product/product/UpdateProductInput";

type Options = PagniationArgs & FindManyOptions<Product>;

@Service()
export class ProductService {
  private readonly relations = ["author", "publisher", "categories", "collections"];

  async findAll(options: Options): Promise<PaginatedProductResponse> {
    const [items, total] = await Product.findAndCount({ relations: this.relations, ...options });
    return { items, total, hasMore: options.skip + options.take < total };
  }

  async create(data: CreateProductInput): Promise<Product> {
    const { id } = await Product.create(data).save();
    const product = await Product.findOne({ where: { id }, relations: this.relations });
    return product!;
  }

  async update(data: UpdateProductInput): Promise<boolean> {
    try {
      const product = await Product.findOne({ where: { id: data.id } });
      Product.merge(product!, data);
      product!.save();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await Product.delete(id);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
