import { Service } from "typedi";
import { FileUpload } from "graphql-upload";

import { Product } from "@api/entity/Product";
import { BaseService } from "@api/modules/services/Base.service";
import { CreateProductInput } from "@api/modules/product/product/CreateProductInput";
import { formatUrlToPath } from "@api/modules/utils/string";
import { UpdateProductInput } from "@api/modules/product/product/UpdateProductInput";

@Service()
export class ProductService extends BaseService<Product> {
  relations = ["publisher", "author", "categories", "collections"];

  async create(data: CreateProductInput, imageFile?: FileUpload): Promise<Product> {
    if (!imageFile) {
      return await super.create(data);
    }

    const res = await this.uploadImage(imageFile);
    return await super.create({ ...data, image: res.Key });
  }

  async update(data: UpdateProductInput, imageFile?: FileUpload): Promise<boolean> {
    if (!imageFile) {
      return await super.update(data);
    }

    const product = await this.repository.findOne({ where: { id: data.id } });
    const res = await this.uploadImage(imageFile, product?.image);

    return await super.update({ ...data, image: res.Key });
  }

  async delete(id: string): Promise<boolean> {
    const product = await this.repository.findOne({ where: { id } });
    if (!product) {
      return true;
    }

    const imagePath = formatUrlToPath(product.image);
    if (imagePath) {
      await this.s3.deleteObject({ Bucket: this.bucket, Key: imagePath }).promise();
    }

    return await super.delete(id);
  }
}
