import { Service } from "typedi";

import { Product } from "@api/entity/Product";
import { BaseService } from "@api/modules/services/Base.service";

@Service()
export class ProductService extends BaseService<Product> {
  relations = ["publisher", "author", "categories", "collections"];
}
