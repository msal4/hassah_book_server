import { Service } from "typedi";
import { getRepository } from "typeorm";

import { BaseService } from "@api/modules/shared/services/Base.service";
import { Purchase } from "@api/entity/Purchase";

@Service()
export class PurchaseService extends BaseService<Purchase> {
  constructor() {
    super(getRepository(Purchase));
  }
}
