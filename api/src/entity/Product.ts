import { ObjectType, Field, ID, registerEnumType, Int, Float } from "type-graphql";
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";

import { Author } from "@api/entity/Author";
import { Publisher } from "@api/entity/Publisher";
import { Category } from "@api/entity/Category";
import { Collection } from "@api/entity/Collection";
import { Favorite } from "@api/entity/Favorite";
import { Purchase } from "@api/entity/Purchase";
import { Lazy } from "@api/modules/types/Lazy";

export enum ProductStatus {
  Available = "Available",
  OnSale = "OnSale",
  ComingSoon = "ComingSoon",
  SoldOut = "SoldOut",
}

registerEnumType(ProductStatus, { name: "ProductStatus" });

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column("text")
  overview: string;

  @Field(() => Float)
  @Column("float")
  price: number;

  @Field()
  @Column("text")
  image: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: "integer", nullable: true })
  pages?: number;

  @Field(() => ProductStatus)
  @Column({
    type: "enum",
    enum: ProductStatus,
    default: ProductStatus.Available,
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
  @ManyToOne(() => Author, (author) => author.products)
  author: Lazy<Author>;

  @Field(() => Publisher, { nullable: true })
  @ManyToOne(() => Publisher, (publisher) => publisher.products)
  publisher?: Lazy<Publisher>;

  @Field()
  @Column("varchar", { default: "en" })
  language: string;

  @OneToMany(() => Favorite, (favorite) => favorite.product)
  favorites: Lazy<Favorite[]>;

  @OneToMany(() => Purchase, (purchase) => purchase.product)
  purchases: Lazy<Purchase[]>;

  @Field(() => [Category])
  @ManyToMany(() => Category, (category) => category.products)
  categories: Lazy<Category[]>;

  @Field(() => [Collection])
  @ManyToMany(() => Collection, (collection) => collection.products)
  collections: Lazy<Collection[]>;
}
