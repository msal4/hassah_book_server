import { ObjectType, Field } from "type-graphql";
import { Entity, Column } from "typeorm";

import { BaseUser } from "@api/entity/shared/BaseUser";

@ObjectType()
@Entity()
export class Admin extends BaseUser {
  @Field()
  @Column({ unique: true })
  email: string;
}
