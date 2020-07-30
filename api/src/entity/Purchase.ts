import { ObjectType, Field, ID, Int } from "type-graphql";
import {
  Entity,
  BaseEntity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Product } from "@api/entity/Product";
import { Order } from "@api/entity/Order";

@ObjectType()
@Entity()
export class Purchase extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field(() => Int)
  @Column({ type: "integer", default: 1 })
  quantity: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Product)
  @ManyToOne(() => Product, product => product.favorites)
  product: Promise<Product>;

  @Field(() => Order)
  @ManyToOne(() => Order, order => order.purchases)
  order: Promise<Order>;
}
