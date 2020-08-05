import { ClassType, ObjectType, Field, Int } from "type-graphql";

import { Product } from "@api/entity/Product";
import { Favorite } from "@api/entity/Favorite";
import { Category } from "@api/entity/Category";
import { Collection } from "@api/entity/Collection";
import { Author } from "@api/entity/Author";
import { Publisher } from "@api/entity/Publisher";

export function PaginatedResponse<T>(TClass: ClassType<T>) {
  @ObjectType(`Paginated${TClass.name}Response`)
  class PaginatedResponseClass {
    @Field(() => [TClass])
    items: T[];

    @Field(() => Int)
    total: number;

    @Field()
    hasMore: boolean;
  }

  return PaginatedResponseClass;
}

export const PaginatedCategoryResponse = PaginatedResponse(Category);
export type PaginatedCategoryResponse = InstanceType<typeof PaginatedCategoryResponse>;

export const PaginatedCollectionResponse = PaginatedResponse(Collection);
export type PaginatedCollectionResponse = InstanceType<typeof PaginatedCollectionResponse>;

export const PaginatedAuthorResponse = PaginatedResponse(Author);
export type PaginatedAuthorResponse = InstanceType<typeof PaginatedAuthorResponse>;

export const PaginatedPublisherResponse = PaginatedResponse(Publisher);
export type PaginatedPublisherResponse = InstanceType<typeof PaginatedPublisherResponse>;

export const PaginatedProductResponse = PaginatedResponse(Product);
export type PaginatedProductResponse = InstanceType<typeof PaginatedProductResponse>;

export const PaginatedFavoriteResponse = PaginatedResponse(Favorite);
export type PaginatedFavoriteResponse = InstanceType<typeof PaginatedFavoriteResponse>;
