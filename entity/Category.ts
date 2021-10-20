import { ObjectType } from "type-graphql";
import { Entity, ManyToMany, JoinTable } from "typeorm";

import { Product } from "@api/entity/Product";
import { Lazy } from "@api/modules/types/Lazy";
import { BaseProductParent } from "./base/BaseProductParent";

@ObjectType()
@Entity()
export class Category extends BaseProductParent {
  @ManyToMany(() => Product, (product) => product.categories)
  @JoinTable()
  products: Lazy<Product[]>;
}
