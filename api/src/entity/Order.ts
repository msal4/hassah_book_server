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
import { Lazy } from "@api/modules/shared/types/Lazy";

export enum OrderStatus {
  Pending = "Pending",
  Processed = "Processed",
  Delivering = "Delivering",
  Delivered = "Delivered",
  Failed = "Failed",
  Canceled = "Canceled",
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field(() => OrderStatus)
  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: Lazy<User>;

  @OneToMany(() => Purchase, (purchase) => purchase.order)
  purchases: Lazy<Purchase[]>;
}
