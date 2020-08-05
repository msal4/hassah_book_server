import { Resolver, FieldResolver, Root, Args } from "type-graphql";
import { Service } from "typedi";

import { PagniationArgs } from "@api/modules/shared/PaginationArgs";
import { PaginatedProductResponse } from "@api/shared/PaginatedResponse";
import { Collection } from "@api/entity/Collection";
import { CollectionService } from "../services/Collection.service";

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
