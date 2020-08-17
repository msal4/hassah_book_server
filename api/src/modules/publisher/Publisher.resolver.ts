import { Resolver, Query, Args, Mutation, Arg, Authorized } from "type-graphql";

import { FilterArgs } from "@api/modules/types/FilterArgs";
import { PaginatedPublisherResponse } from "@api/modules/types/PaginatedResponse";
import { CreatePublisherInput } from "@api/modules/publisher/publisher/CreatePublisherInput";
import { UpdatePublisherInput } from "@api/modules/publisher/publisher/UpdatePublisherInput";
import { PublisherService } from "@api/modules/publisher/publisher/Publisher.service";
import { Publisher } from "@api/entity/Publisher";
import { Roles } from "@api/modules/utils/auth";

@Resolver()
export class PublisherResolver {
  constructor(private readonly service: PublisherService) {}

  @Query(() => PaginatedPublisherResponse)
  async publishers(@Args() args: FilterArgs): Promise<PaginatedPublisherResponse> {
    return this.service.findAll(args);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Publisher)
  async createPublisher(@Arg("data") data: CreatePublisherInput): Promise<Publisher> {
    return this.service.create(data);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  async updatePublisher(@Arg("data") data: UpdatePublisherInput): Promise<boolean> {
    return this.service.update(data);
  }
}
