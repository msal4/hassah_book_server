import { Field, ID, ObjectType, Int } from "type-graphql";
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BaseEntity,
} from "typeorm";
import { hash, compare } from "bcryptjs";

import { PASSWORD_SALT } from "@api/modules/constants/user";

@ObjectType({ isAbstract: true })
export abstract class BaseUser extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @Column()
  name: string;

  @Column()
  password: string;

  @Field(() => Int)
  @Column({ type: "integer", default: 0 })
  tokenVersion?: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, PASSWORD_SALT);
  }

  validatePassword(password: string) {
    return compare(password, this.password);
  }
}
