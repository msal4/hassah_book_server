import { ObjectType, Field, ID, registerEnumType, Int } from "type-graphql";
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Author } from "./Author";
import { Publisher } from "./Publisher";
import { ProductType } from "./ProductType";
import { Category } from "./Category";
import { Collection } from "./Collection";
import { Favorite } from "./Favorite";

export enum ProductStatus {
  AVAILABLE = "available",
  ON_SALE = "on_sale",
  COMING_SOON = "coming_soon",
  SOLD_OUT = "sold_out",
}

registerEnumType(ProductStatus, { name: "ProductStatus" });

@ObjectType()
@Entity()
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column("text")
  overview: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: "integer", nullable: true })
  pages?: number;

  @Field(() => ProductStatus)
  @Column({
    type: "enum",
    enum: ProductStatus,
    default: ProductStatus.AVAILABLE,
  })
  status: ProductStatus;

  @Field()
  @Column({ type: "timestamp", default: "now()" })
  publishedAt: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Author)
  @ManyToOne(() => Author, author => author.products)
  author: Author;

  @Field(() => Publisher)
  @ManyToOne(() => Publisher, publisher => publisher.products)
  publisher: Publisher;

  @Field(() => ProductType)
  @ManyToOne(() => ProductType, type => type.products)
  type: ProductType;

  @Field(() => [Favorite])
  @ManyToOne(() => Favorite, favorite => favorite.product)
  favorites: Promise<Favorite[]>;

  @Field(() => [Category])
  @ManyToMany(() => Category, category => category.products)
  categories: Promise<Category[]>;

  @Field(() => [Collection])
  @ManyToMany(() => Collection, collection => collection.products)
  collections: Promise<Collection[]>;
}
