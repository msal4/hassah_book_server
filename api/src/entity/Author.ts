import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";

import { Product } from "./Product";

@ObjectType()
@Entity()
export class Author extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  overview: string;

  @Field()
  @Column()
  image: string;

  @Field(() => [Product])
  @OneToMany(() => Product, product => product.author)
  products: Product[];
}
