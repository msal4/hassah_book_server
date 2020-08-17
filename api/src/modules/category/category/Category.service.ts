import { Service } from "typedi";

import { Category } from "@api/entity/Category";
import { BaseService } from "@api/modules/services/Base.service";

@Service()
export class CategoryService extends BaseService<Category> {}
