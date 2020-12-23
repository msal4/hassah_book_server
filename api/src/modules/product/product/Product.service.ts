import { Service } from "typedi";
import { FileUpload } from "graphql-upload";

import { Product } from "@api/entity/Product";
import { BaseService } from "@api/modules/services/Base.service";
import { CreateProductInput } from "@api/modules/product/product/CreateProductInput";
import { S3Service } from "@api/modules/s3/S3.service";
import { formatFileName } from "@api/modules/utils/string";

@Service()
export class ProductService extends BaseService<Product> {
  constructor(private readonly s3Service: S3Service) {
    super();
  }

  relations = ["publisher", "author", "categories", "collections"];

  async create(data: CreateProductInput, imageFile?: FileUpload): Promise<Product> {
    if (!imageFile) {
      return await super.create(data);
    }

    const res = await this.s3Service.s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: `images/products/${formatFileName(imageFile.filename)}`,
        Body: imageFile.createReadStream(),
        ACL: "public-read",
      })
      .promise();

    return await super.create({ image: res.Location, ...data });
  }
}
