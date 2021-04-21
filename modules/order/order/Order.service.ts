import { Service } from "typedi";

import { BaseService } from "@api/modules/services/Base.service";
import { Order } from "@api/entity/Order";

@Service()
export class OrderService extends BaseService<Order> {
  relations = ["user"];
}
