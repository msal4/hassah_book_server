import { ObjectType, Field, ID, Int } from "type-graphql";
import {
  Entity,
  BaseEntity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Product } from "./Product";
import { Order } from "./Order";

@ObjectType()
@Entity()
export class Purchase extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Int)
  @Column({ type: "integer", default: 1 })
  quantity: number;

  @Field()
  @Column({ type: "timestamp", default: "now()" })
  createdAt: Date;

  @Field()
  @Column({
    type: "timestamp",
    default: "now()",
    onUpdate: "now()",
  })
  updatedAt: Date;

  @Field(() => Product)
  @ManyToOne(() => Product, product => product.favorites)
  product: Product;

  @Field(() => Order)
  @ManyToOne(() => Order, order => order.purchases)
  order: Order;
}
