import { InputType, Field, Int, Float } from "type-graphql";

import { ProductStatus } from "@api/entity/Product";
import { ObjectIdInput } from "@api/modules/types/ObjectIdInput";

@InputType({ description: "The input data for creating new products." })
export class CreateProductInput {
  @Field({ description: "The name of the product." })
  name: string;

  @Field({ description: "A brief description of the product." })
  overview: string;

  @Field(() => Float, { description: "Product price." })
  price: number;

  @Field({ description: "The current status of the product." })
  status?: ProductStatus;

  @Field(() => Int, {
    description: "If the product is a book, then this would represent the number of pages.",
    nullable: true,
  })
  pages?: number;

  @Field(() => String, {
    description: "The language of the product.",
    nullable: true,
  })
  language?: string;

  @Field(() => ObjectIdInput, { description: "The author/owner of the product." })
  author: ObjectIdInput;

  @Field(() => ObjectIdInput, {
    description: "The publisher/manufacturer of the product.",
    nullable: true,
  })
  publisher?: ObjectIdInput;

  @Field(() => [ObjectIdInput], {
    description: "The categories that this product fit's in.",
  })
  categories: ObjectIdInput[];

  @Field(() => [ObjectIdInput], {
    description: "The featured collections, if any.",
  })
  collections: ObjectIdInput[];

  @Field({ description: "The publication/release date.", nullable: true })
  publishedAt?: Date;
}
