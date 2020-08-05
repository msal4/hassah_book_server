import { Lazy } from "@api/modules/types/Lazy";
import { Product } from "@api/entity/Product";

export interface BaseGroup {
  products: Lazy<Product[]>;
  totalProducts?: number;
}
