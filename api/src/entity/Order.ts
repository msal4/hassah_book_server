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

import { User } from "@api/entity/User";
import { Purchase } from "@api/entity/Purchase";
import { Lazy } from "@api/modules/types/Lazy";

export enum OrderStatus {
  Pending = "Pending",
  Processed = "Processed",
  Delivering = "Delivering",
  Delivered = "Delivered",
  Failed = "Failed",
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
  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, user => user.orders)
  user: Lazy<User>;

  @Field(() => Purchase)
  @OneToMany(() => Purchase, purchase => purchase.order)
  purchases: Lazy<Purchase[]>;
}
