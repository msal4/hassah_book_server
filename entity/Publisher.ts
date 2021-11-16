import { ObjectType } from "type-graphql";
import { Entity, OneToMany } from "typeorm";

import { Product } from "@api/entity/Product";
import { Lazy } from "@api/modules/types/Lazy";
import { BaseProductParent } from "@api/entity/base/BaseProductParent";

@ObjectType()
@Entity()
export class Publisher extends BaseProductParent {
  @OneToMany(() => Product, (product) => product.publisher, { cascade: true })
  products: Lazy<Product[]>;
}
