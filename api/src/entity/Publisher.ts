import { ObjectType, Field } from "type-graphql";
import { Entity, OneToMany } from "typeorm";

import { Product } from "@api/entity/Product";
import { Lazy } from "@api/modules/shared/types/Lazy";
import { BaseProductParent } from "@api/entity/shared/BaseProductParent";

@ObjectType()
@Entity()
export class Publisher extends BaseProductParent {
  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.publisher)
  products: Lazy<Product[]>;
}
