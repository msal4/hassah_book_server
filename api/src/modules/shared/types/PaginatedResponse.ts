import { ClassType, ObjectType, Field, Int } from "type-graphql";

import { Product } from "@api/entity/Product";
import { Favorite } from "@api/entity/Favorite";
import { Category } from "@api/entity/Category";
import { Collection } from "@api/entity/Collection";
import { Author } from "@api/entity/Author";
import { Publisher } from "@api/entity/Publisher";
import { UserRequest } from "@api/entity/UserRequest";
import { Order } from "@api/entity/Order";
import { Purchase } from "@api/entity/Purchase";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}

export function PaginatedResponse<T>(TClass: ClassType<T>) {
  @ObjectType(`Paginated${TClass.name}Response`)
  class PaginatedResponseClass implements PaginatedResponse<T> {
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

export const PaginatedUserRequestResponse = PaginatedResponse(UserRequest);
export type PaginatedUserRequestResponse = InstanceType<typeof PaginatedUserRequestResponse>;

export const PaginatedOrderResponse = PaginatedResponse(Order);
export type PaginatedOrderResponse = InstanceType<typeof PaginatedOrderResponse>;

export const PaginatedPurchaseResponse = PaginatedResponse(Purchase);
export type PaginatedPurchaseResponse = InstanceType<typeof PaginatedPurchaseResponse>;
