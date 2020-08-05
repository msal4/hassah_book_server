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
import { hash, compare } from "bcryptjs";

import { UserRequest } from "@api/entity/UserRequest";
import { Favorite } from "@api/entity/Favorite";
import { Order } from "@api/entity/Order";
import { normalizePhone } from "@api/modules/utils/normalizePhone";
import { Lazy } from "@api/modules/shared/types/Lazy";

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
  @OneToMany(() => UserRequest, (request) => request.user)
  requests: Lazy<UserRequest[]>;

  @Field(() => [Favorite])
  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Lazy<Favorite[]>;

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.user)
  orders: Lazy<Order[]>;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 12);
  }

  @BeforeInsert()
  async normalizePhone() {
    this.phone = normalizePhone(this.phone);
  }

  // Compares the user password with the provided passowrd.
  validatePassword(password: string) {
    return compare(password, this.password);
  }
}
