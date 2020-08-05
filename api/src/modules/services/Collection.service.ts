import { Service } from "typedi";

import { Collection } from "@api/entity/Collection";
import BaseGroupService from "@api/modules/services/BaseGroupService.service";

@Service()
export class CollectionService extends BaseGroupService<Collection> {
  constructor() {
    super("Collection");
  }
}
