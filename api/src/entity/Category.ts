import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from "typeorm";

import { Product } from "@api/entity/Product";
import { Lazy } from "@api/modules/types/Lazy";

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Product, (product) => product.categories)
  @JoinTable()
  products: Lazy<Product[]>;

  // the count is used in the CategoryEntity resolver to return a paginated response,
  // it might not be the perfect place for it but for now I'll leave it here.
  totalProducts?: number;
}
