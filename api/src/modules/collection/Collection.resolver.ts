import { Resolver, Query, Args, Mutation, Arg, Authorized } from "type-graphql";

import { CollectionService } from "@api/modules/collection/collection/Collection.service";
import { PaginatedCollectionResponse } from "@api/modules/types/PaginatedResponse";
import { FilterArgs } from "@api/modules/types/FilterArgs";
import { Collection } from "@api/entity/Collection";
import { CreateCollectionInput } from "@api/modules/collection/collection/CreateCollectionInput";
import { UpdateCollectionInput } from "@api/modules/collection/collection/UpdateCollectionInput";
import { Roles } from "@api/modules/utils/auth";

@Resolver()
export class CollectionResolver {
  constructor(private readonly collectionService: CollectionService) {}
  @Query(() => PaginatedCollectionResponse)
  collections(@Args() args: FilterArgs): Promise<PaginatedCollectionResponse> {
    return this.collectionService.findAll(args);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Collection)
  createCollection(@Arg("data") data: CreateCollectionInput): Promise<Collection> {
    return this.collectionService.create(data);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  updateCollection(@Arg("data") data: UpdateCollectionInput): Promise<boolean> {
    return this.collectionService.update(data);
  }
}
