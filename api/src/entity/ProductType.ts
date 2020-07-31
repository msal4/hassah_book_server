import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

import { Product } from "@api/entity/Product";
import { Lazy } from "@api/modules/types/Lazy";

@ObjectType()
@Entity()
export class ProductType extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Product])
  @OneToMany(() => Product, product => product.type)
  products: Lazy<Product[]>;
}
