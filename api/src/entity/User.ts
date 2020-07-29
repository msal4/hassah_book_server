import { ObjectType, Field, ID, Int } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { UserRequest } from "./UserRequest";
import { Favorite } from "./Favorite";
import { Order } from "./Order";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  phone: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Column()
  password: string;

  @Field(() => Int)
  @Column({ type: "integer", default: 0 })
  tokenVersion?: number;

  @Field()
  @Column({ type: "boolean", default: false })
  confirmed: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [UserRequest])
  @OneToMany(() => UserRequest, request => request.user)
  requests: UserRequest[];

  @Field(() => [Favorite])
  @OneToMany(() => Favorite, favorite => favorite.user)
  favorites: Favorite[];

  @Field(() => [Order])
  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}
