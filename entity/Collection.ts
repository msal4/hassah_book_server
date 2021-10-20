import { ObjectType, Field } from "type-graphql";
import { Entity, Column, ManyToMany, JoinTable } from "typeorm";

import { Product } from "@api/entity/Product";
import { Lazy } from "@api/modules/types/Lazy";
import { BaseProductParent } from "./base/BaseProductParent";

@ObjectType()
@Entity()
export class Collection extends BaseProductParent {
  @Field()
  @Column()
  image: string;

  @ManyToMany(() => Product, (product) => product.collections)
  @JoinTable()
  products: Lazy<Product[]>;
}
