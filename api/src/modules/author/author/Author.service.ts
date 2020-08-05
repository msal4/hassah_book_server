import { Service } from "typedi";
import { getRepository } from "typeorm";

import { BaseService } from "@api/modules/shared/services/Base.service";
import { Author } from "@api/entity/Author";

@Service()
export class AuthorService extends BaseService<Author> {
  constructor() {
    super(getRepository(Author));
  }
}
