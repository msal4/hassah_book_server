import { ObjectType, Field, ID, registerEnumType, Float } from "type-graphql";
import {
  Entity,
  BaseEntity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
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
  province: string;

  @Field()
  @Column()
  address: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field(() => OrderStatus)
  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Field(() => Float)
  @Column({ default: 0 })
  totalPrice: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: Lazy<User>;

  @OneToMany(() => Purchase, (purchase) => purchase.order, { cascade: true })
  purchases: Lazy<Purchase[]>;
}
