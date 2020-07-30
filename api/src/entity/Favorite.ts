import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

import { User } from "@api/entity/User";
import { Product } from "@api/entity/Product";

@ObjectType()
@Entity()
export class Favorite extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, user => user.favorites)
  user: Promise<User>;

  @Field(() => Product)
  @ManyToOne(() => Product, product => product.favorites)
  product: Promise<Product>;
}
