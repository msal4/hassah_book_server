import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  BaseEntity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class Favorite extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "timestamp", default: "now()" })
  createdAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, user => user.favorites)
  user: User;

  @Field(() => Product)
  @ManyToOne(() => Product, product => product.favorites)
  product: Product;
}
