import { Service } from "typedi";
import { getRepository } from "typeorm";

import { BaseService } from "@api/modules/shared/services/Base.service";
import { Order } from "@api/entity/Order";

@Service()
export class OrderService extends BaseService<Order> {
  constructor() {
    super(getRepository(Order));
  }
}
