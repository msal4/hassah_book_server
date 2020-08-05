import { Service } from "typedi";

import { Category } from "@api/entity/Category";
import BaseGroupService from "@api/modules/services/BaseGroup.service";

@Service()
export class CategoryService extends BaseGroupService<Category> {
  constructor() {
    super("Category");
  }
}
