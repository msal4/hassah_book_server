import { Resolver, Query, Args, Mutation, Arg } from "type-graphql";

import { CollectionService } from "@api/modules/collection/collection/Collection.service";
import { PaginatedCollectionResponse } from "@api/modules/shared/types/PaginatedResponse";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { Collection } from "@api/entity/Collection";
import { CreateCollectionInput } from "@api/modules/collection/collection/CreateCollectionInput";
import { UpdateCollectionInput } from "@api/modules/collection/collection/UpdateCollectionInput";

@Resolver()
export class CollectionResolver {
  constructor(private readonly collectionService: CollectionService) {}
  @Query(() => PaginatedCollectionResponse)
  collections(@Args() args: PagniationArgs): Promise<PaginatedCollectionResponse> {
    return this.collectionService.findAll(args);
  }

  @Mutation(() => Collection)
  createCollection(@Arg("data") data: CreateCollectionInput): Promise<Collection> {
    return this.collectionService.create(data);
  }

  @Mutation(() => Boolean)
  updateCollection(@Arg("data") data: UpdateCollectionInput): Promise<boolean> {
    return this.collectionService.update(data);
  }
}
