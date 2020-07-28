import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";

import { User } from "./User";

export enum UserRequestStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  FAILED = "failed",
  SUCCESS = "success",
}

registerEnumType(UserRequestStatus, { name: "UserRequestStatus" });

@ObjectType({
  description:
    "A request by the user for a certain product. It can also be used for feedback.",
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
    default: UserRequestStatus.PENDING,
  })
  status: UserRequestStatus;

  @Field()
  @Column({ type: "timestamp", default: "now()" })
  createdAt: Date;

  @Field(() => User, { description: "The user who made the request" })
  @ManyToOne(() => User, user => user.requests)
  user: User;
}
