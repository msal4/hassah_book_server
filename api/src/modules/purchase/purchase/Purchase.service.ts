import { Service } from "typedi";

import { BaseService } from "@api/modules/shared/services/Base.service";
import { Purchase } from "@api/entity/Purchase";

@Service()
export class PurchaseService extends BaseService<Purchase> {}
