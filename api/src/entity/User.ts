import { ObjectType, Field, ID, Int } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { genSalt, hash, compare } from "bcryptjs";

import { UserRequest } from "@api/entity/UserRequest";
import { Favorite } from "@api/entity/Favorite";
import { Order } from "@api/entity/Order";

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
  requests: Promise<UserRequest[]>;

  @Field(() => [Favorite])
  @OneToMany(() => Favorite, favorite => favorite.user)
  favorites: Promise<Favorite[]>;

  @Field(() => [Order])
  @OneToMany(() => Order, order => order.user)
  orders: Promise<Order[]>;

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await genSalt();
    this.password = await hash(password, salt);
  }

  // Compares the user password with the provided passowrd.
  verifyPassword(password: string) {
    return compare(this.password, password);
  }
}
