import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "@api/entity/User";
import { Lazy } from "@api/modules/shared/types/Lazy";

export enum UserRequestStatus {
  Pending = "Pending",
  Processing = "Processing",
  Failed = "Failed",
  Success = "Success",
}

registerEnumType(UserRequestStatus, { name: "UserRequestStatus" });

@ObjectType({
  description: "A request by the user for a certain product. It can also be used for feedback.",
})
@Entity()
export class UserRequest extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @Column("text")
  content: string;

  @Field(() => UserRequestStatus, {
    description: "The current status of the request.",
  })
  @Column({
    type: "enum",
    enum: UserRequestStatus,
    default: UserRequestStatus.Pending,
  })
  status: UserRequestStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User, { description: "The user who made the request" })
  @ManyToOne(() => User, (user) => user.requests)
  user: Lazy<User>;
}
