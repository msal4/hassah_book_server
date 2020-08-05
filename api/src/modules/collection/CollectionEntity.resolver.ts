import { Resolver, FieldResolver, Root, Args } from "type-graphql";
import { Service } from "typedi";

import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { PaginatedProductResponse } from "@api/modules/shared/types/PaginatedResponse";
import { Collection } from "@api/entity/Collection";
import { CollectionService } from "@api/modules/services/Collection.service";

@Service()
@Resolver(() => Collection)
export class CollectionEntityResolver {
  constructor(private readonly collectionService: CollectionService) {}

  @FieldResolver(() => PaginatedProductResponse)
  products(
    @Root() collection: Collection,
    @Args() paginationArgs: PagniationArgs
  ): Promise<PaginatedProductResponse> {
    return this.collectionService.findProducts({ groupId: collection.id, paginationArgs });
  }
}
