import { Resolver, Query, Args, Mutation, Arg, Authorized } from "type-graphql";

import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { PaginatedAuthorResponse } from "@api/modules/shared/types/PaginatedResponse";
import { CreateAuthorInput } from "@api/modules/author/author/CreateAuthorInput";
import { UpdateAuthorInput } from "@api/modules/author/author/UpdateAuthorInput";
import { AuthorService } from "@api/modules/author/author/Author.service";
import { Author } from "@api/entity/Author";
import { Roles } from "@api/modules/utils/auth";

@Resolver()
export class AuthorResolver {
  constructor(private readonly service: AuthorService) {}

  @Query(() => PaginatedAuthorResponse)
  async authors(@Args() args: PagniationArgs): Promise<PaginatedAuthorResponse> {
    return this.service.findAll(args);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Author)
  async createAuthor(@Arg("data") data: CreateAuthorInput): Promise<Author> {
    return this.service.create(data);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  async updateAuthor(@Arg("data") data: UpdateAuthorInput): Promise<boolean> {
    return this.service.update(data);
  }
}
