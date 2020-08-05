import { ClassType, ObjectType, Field, Int } from "type-graphql";

import { Product } from "@api/entity/Product";
import { Favorite } from "@api/entity/Favorite";
import { Category } from "@api/entity/Category";
import { Collection } from "@api/entity/Collection";

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

export const PaginatedProductResponse = PaginatedResponse(Product);
export type PaginatedProductResponse = InstanceType<typeof PaginatedProductResponse>;

export const PaginatedFavoriteResponse = PaginatedResponse(Favorite);
export type PaginatedFavoriteResponse = InstanceType<typeof PaginatedFavoriteResponse>;
