import { ClassType, ObjectType, Field, Int } from "type-graphql";

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
