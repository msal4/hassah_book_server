import { Service } from "typedi";
import { Resolver, Query, Args, Mutation, Arg } from "type-graphql";

import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import { PaginatedAuthorResponse } from "@api/modules/shared/types/PaginatedResponse";
import { CreateAuthorInput } from "@api/modules/author/author/CreateAuthorInput";
import { UpdateAuthorInput } from "@api/modules/author/author/UpdateAuthorInput";
import { AuthorService } from "@api/modules/author/author/Author.service";
import { Author } from "@api/entity/Author";

@Service()
@Resolver()
export class AuthorResolver {
  constructor(private readonly service: AuthorService) {}

  @Query(() => PaginatedAuthorResponse)
  async authors(@Args() args: PagniationArgs): Promise<PaginatedAuthorResponse> {
    return this.service.findAll(args);
  }

  @Mutation(() => Author)
  async createAuthor(@Arg("data") data: CreateAuthorInput): Promise<Author> {
    return this.service.create(data);
  }

  @Mutation(() => Boolean)
  async updateAuthor(@Arg("data") data: UpdateAuthorInput): Promise<boolean> {
    return this.service.update(data);
  }
}
