import { Service } from "typedi";

import { BaseService } from "@api/modules/services/Base.service";
import { Author } from "@api/entity/Author";

@Service()
export class AuthorService extends BaseService<Author> {}
