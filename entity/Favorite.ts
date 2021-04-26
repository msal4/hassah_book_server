import { ObjectType, Field, ID } from "type-graphql";
import { Entity, BaseEntity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, Unique } from "typeorm";

import { User } from "@api/entity/User";
import { Product } from "@api/entity/Product";
import { Lazy } from "@api/modules/types/Lazy";

@ObjectType()
@Entity()
@Unique("unique_favorite", ["user", "product"])
export class Favorite extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.favorites)
  user: Lazy<User>;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.favorites)
  product: Lazy<Product>;
}
