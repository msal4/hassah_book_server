import { Resolver, Query, Args, Mutation, Arg, Authorized, ID } from "type-graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";

import { FilterArgs } from "@api/modules/types/FilterArgs";
import { PaginatedAuthorResponse } from "@api/modules/types/PaginatedResponse";
import { CreateAuthorInput } from "@api/modules/author/author/CreateAuthorInput";
import { UpdateAuthorInput } from "@api/modules/author/author/UpdateAuthorInput";
import { AuthorService } from "@api/modules/author/author/Author.service";
import { Author } from "@api/entity/Author";
import { Roles } from "@api/modules/utils/auth";

@Resolver()
export class AuthorResolver {
  constructor(private readonly service: AuthorService) {}

  @Query(() => Author, { nullable: true })
  author(@Arg("id", () => ID) id: string): Promise<Author | null> {
    return this.service.findOne(id);
  }

  @Query(() => PaginatedAuthorResponse)
  authors(@Args() args: FilterArgs): Promise<PaginatedAuthorResponse> {
    return this.service.findAll(args);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Author)
  async createAuthor(
    @Arg("data") data: CreateAuthorInput,
    @Arg("imageFile", () => GraphQLUpload) imageFile: Promise<FileUpload>
  ): Promise<Author> {
    return this.service.create(data, await imageFile);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  async updateAuthor(@Arg("data") data: UpdateAuthorInput, imageFile: Promise<FileUpload>): Promise<boolean> {
    return this.service.update(data, await imageFile);
  }
}
