import { Service } from "typedi";

import { BaseService } from "@api/modules/shared/services/Base.service";
import { Author } from "@api/entity/Author";

@Service()
export class AuthorService extends BaseService<Author> {
  Entity = Author;
}
