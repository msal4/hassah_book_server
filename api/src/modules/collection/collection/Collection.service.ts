import { Service } from "typedi";

import { Collection } from "@api/entity/Collection";
import { BaseService } from "@api/modules/shared/services/Base.service";

@Service()
export class CollectionService extends BaseService<Collection> {}
