import { InputType, Field, Int } from "type-graphql";

import { ProductStatus } from "@api/entity/Product";
import { ObjectId } from "@api/modules/shared/ObjectId";

@InputType({ description: "The input data for creating new products." })
export class CreateProductInput {
  @Field({ description: "The name of the product." })
  name: string;

  @Field({ description: "A brief description of the product." })
  overview: string;

  @Field({ description: "An poster or cover image for the product." })
  image: string;

  @Field({ description: "The current status of the product." })
  status?: ProductStatus;

  @Field(() => Int, {
    description: "If the product is a book, then this would represent the number of pages.",
    nullable: true,
  })
  pages?: number;

  @Field(() => ObjectId, { description: "The author/owner of the product." })
  author: ObjectId;

  @Field(() => ObjectId, {
    description: "The publisher/manufacturer of the product.",
    nullable: true,
  })
  publisher?: ObjectId;

  @Field(() => [ObjectId], {
    description: "The categories that this product fit's in.",
  })
  categories: ObjectId[];

  @Field(() => [ObjectId], {
    description: "The featured collections, if any.",
  })
  collections: ObjectId[];

  @Field({ description: "The publication/release date.", nullable: true })
  publishedAt?: Date;
}
