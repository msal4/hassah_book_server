import { ObjectType, Field } from "type-graphql";
import { Entity, Column, OneToMany } from "typeorm";

import { BaseProductParent } from "@api/entity/base/BaseProductParent";
import { Product } from "@api/entity/Product";
import { Lazy } from "@api/modules/types/Lazy";

@ObjectType()
@Entity()
export class Author extends BaseProductParent {
  @Field()
  @Column()
  overview: string;

  @Field()
  @Column()
  image: string;

  @OneToMany(() => Product, (product) => product.author, { cascade: true })
  products: Lazy<Product[]>;
}
