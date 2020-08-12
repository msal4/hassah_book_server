import { ObjectType, Field } from "type-graphql";
import { Entity, Column, OneToMany } from "typeorm";

import { BaseProductParent } from "@api/entity/shared/BaseProductParent";
import { Product } from "@api/entity/Product";
import { Lazy } from "@api/modules/shared/types/Lazy";

@ObjectType()
@Entity()
export class Author extends BaseProductParent {
  @Field()
  @Column()
  overview: string;

  @Field()
  @Column()
  image: string;

  @OneToMany(() => Product, (product) => product.author)
  products: Lazy<Product[]>;
}
