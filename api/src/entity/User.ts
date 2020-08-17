import { ObjectType, Field } from "type-graphql";
import { Entity, Column, OneToMany, BeforeInsert } from "typeorm";

import { UserRequest } from "@api/entity/UserRequest";
import { Favorite } from "@api/entity/Favorite";
import { Order } from "@api/entity/Order";
import { normalizePhone } from "@api/modules/utils/normalizePhone";
import { Lazy } from "@api/modules/types/Lazy";
import { BaseUser } from "@api/entity/base/BaseUser";

@ObjectType()
@Entity()
export class User extends BaseUser {
  @Field()
  @Column({ unique: true })
  phone: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Field()
  @Column({ type: "boolean", default: false })
  confirmed: boolean;

  @OneToMany(() => UserRequest, (request) => request.user)
  requests: Lazy<UserRequest[]>;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Lazy<Favorite[]>;

  @OneToMany(() => Order, (order) => order.user)
  orders: Lazy<Order[]>;

  @BeforeInsert()
  async normalizePhone() {
    this.phone = normalizePhone(this.phone);
  }
}
