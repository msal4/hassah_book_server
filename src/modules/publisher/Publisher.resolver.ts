import { Resolver, Query, Args, Mutation, Arg, Authorized, ID } from "type-graphql";

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

  @Query(() => Publisher, { nullable: true })
  publisher(@Arg("id", () => ID) id: string): Promise<Publisher | null> {
    return this.service.findOne(id);
  }

  @Query(() => PaginatedPublisherResponse)
  publishers(@Args() args: FilterArgs): Promise<PaginatedPublisherResponse> {
    return this.service.findAll(args);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Publisher)
  createPublisher(@Arg("data") data: CreatePublisherInput): Promise<Publisher> {
    return this.service.create(data);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  updatePublisher(@Arg("data") data: UpdatePublisherInput): Promise<boolean> {
    return this.service.update(data);
  }
}
