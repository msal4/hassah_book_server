import { Service } from "typedi";

import { BaseService } from "@api/modules/services/Base.service";
import { Publisher } from "@api/entity/Publisher";

@Service()
export class PublisherService extends BaseService<Publisher> {}
