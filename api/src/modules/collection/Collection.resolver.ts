import { Resolver, Query, Args } from "type-graphql";
import { Service } from "typedi";

import { CollectionService } from "@api/modules/services/Collection.service";
import { PaginatedCollectionResponse } from "@api/shared/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/PaginationArgs";

@Service()
@Resolver()
export class CollectionResolver {
  constructor(private readonly collectionService: CollectionService) {}
  @Query(() => PaginatedCollectionResponse)
  collections(@Args() args: PagniationArgs): Promise<PaginatedCollectionResponse> {
    return this.collectionService.findAll(args);
  }
}
