import { Resolver, Query, Args, Mutation, Arg, Authorized } from "type-graphql";
import { FileUpload } from "graphql-upload";

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
  async createCollection(
    @Arg("data") data: CreateCollectionInput,
    imageFile?: Promise<FileUpload>
  ): Promise<Collection> {
    return this.collectionService.create(data, await imageFile);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  async updateCollection(
    @Arg("data") data: UpdateCollectionInput,
    imageFile?: Promise<FileUpload>
  ): Promise<boolean> {
    return this.collectionService.update(data, await imageFile);
  }
}
