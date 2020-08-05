import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Product } from "@api/entity/Product";
import { Lazy } from "@api/modules/shared/types/Lazy";
import { BaseGroup } from "@api/modules/shared/types/BaseGroup";

@ObjectType()
@Entity()
export class Collection extends BaseEntity implements BaseGroup {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  image: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Product, (product) => product.collections)
  @JoinTable()
  products: Lazy<Product[]>;

  totalProducts?: number;
}
