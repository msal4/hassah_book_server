import { Resolver, Query, Args, Mutation, Arg } from "type-graphql";

import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { PaginatedPublisherResponse } from "@api/modules/shared/types/PaginatedResponse";
import { CreatePublisherInput } from "@api/modules/publisher/publisher/CreatePublisherInput";
import { UpdatePublisherInput } from "@api/modules/publisher/publisher/UpdatePublisherInput";
import { PublisherService } from "@api/modules/publisher/publisher/Publisher.service";
import { Publisher } from "@api/entity/Publisher";

@Resolver()
export class PublisherResolver {
  constructor(private readonly service: PublisherService) {}

  @Query(() => PaginatedPublisherResponse)
  async publishers(@Args() args: PagniationArgs): Promise<PaginatedPublisherResponse> {
    return this.service.findAll(args);
  }

  @Mutation(() => Publisher)
  async createPublisher(@Arg("data") data: CreatePublisherInput): Promise<Publisher> {
    return this.service.create(data);
  }

  @Mutation(() => Boolean)
  async updatePublisher(@Arg("data") data: UpdatePublisherInput): Promise<boolean> {
    return this.service.update(data);
  }
}
