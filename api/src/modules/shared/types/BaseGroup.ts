import { BaseEntity } from "typeorm";
import { Lazy } from "@api/modules/shared/types/Lazy";
import { Product } from "@api/entity/Product";

export interface BaseGroup extends BaseEntity {
  products: Lazy<Product[]>;
  totalProducts?: number;
}
