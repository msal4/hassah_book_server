import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

import { User } from "./User";
import { Purchase } from "./Purchase";

export enum OrderStatus {
  PENDING = "pending",
  PROCESSED = "processed",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  FAILED = "failed",
}

registerEnumType(OrderStatus, {
  name: "OrderStatus",
  description: "The purchases order current status.",
});

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @Column()
  address: string;

  @Field(() => OrderStatus)
  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, user => user.orders)
  user: User;

  @Field(() => Purchase)
  @OneToMany(() => Purchase, purchase => purchase.order)
  purchases: Purchase[];
}
