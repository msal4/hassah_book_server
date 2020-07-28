import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
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
  id: string;

  @Field()
  @Column()
  address: string;

  @Field(() => OrderStatus)
  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

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

  @Field(() => User)
  @ManyToOne(() => User, user => user.orders)
  user: User;

  @Field(() => Purchase)
  @OneToMany(() => Purchase, purchase => purchase.order)
  purchases: Purchase[];
}
