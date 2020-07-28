import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { Product } from "./Product";

@ObjectType()
@Entity()
export class Collection extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  image: string;

  @Field(() => [Product])
  @ManyToMany(() => Product, product => product.collections)
  @JoinTable()
  products: Product[];
}
