import { Service } from "typedi";
import { FileUpload } from "graphql-upload";
import { DeepPartial } from "typeorm";

import { Product } from "@api/entity/Product";
import { BaseService } from "@api/modules/services/Base.service";
import { CreateProductInput } from "@api/modules/product/product/CreateProductInput";
import { S3Service } from "@api/modules/s3/S3.service";
import { formatFileName, formatUrlToPath } from "@api/modules/utils/string";
import { UpdateProductInput } from "@api/modules/product/product/UpdateProductInput";

@Service()
export class ProductService extends BaseService<Product> {
  constructor(private readonly s3Service: S3Service) {
    super();
  }

  relations = ["publisher", "author", "categories", "collections"];

  private readonly bucket = process.env.AWS_S3_BUCKET!;
  private readonly imagesPath = "images/products";

  async create(data: CreateProductInput, imageFile?: FileUpload): Promise<Product> {
    if (!imageFile) {
      return await super.create(data);
    }

    const res = await this.uploadImage(data, imageFile);
    return await super.create({ ...data, image: res.Location });
  }

  async update(data: UpdateProductInput, imageFile?: FileUpload): Promise<boolean> {
    if (!imageFile) {
      return await super.update(data);
    }

    const res = await this.uploadImage(data, imageFile);
    return await super.update({ ...data, image: res.Location });
  }

  async delete(id: string): Promise<boolean> {
    const product = await this.repository.findOne({ where: { id } });
    if (!product) {
      return true;
    }

    const imagePath = formatUrlToPath(product.image);
    imagePath && (await this.s3Service.s3.deleteObject({ Bucket: this.bucket, Key: imagePath }).promise());

    return await super.delete(id);
  }

  private uploadFile(path: string, file: FileUpload) {
    return this.s3Service.s3
      .upload({
        Bucket: this.bucket,
        Key: path,
        Body: file.createReadStream(),
        ACL: "public-read",
      })
      .promise();
  }

  private async uploadImage(data: DeepPartial<Product> & { id?: string }, imageFile: FileUpload) {
    const newImagePath = `${this.imagesPath}/${formatFileName(imageFile.filename)}`;

    if (data.id) {
      const product = await this.repository.findOne({ where: { id: data.id } });
      const imagePath = product && formatUrlToPath(product.image);
      return await this.uploadFile(imagePath ?? newImagePath, imageFile);
    }

    return await this.uploadFile(newImagePath, imageFile);
  }
}
