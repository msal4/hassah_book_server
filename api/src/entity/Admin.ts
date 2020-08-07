import { ObjectType, Field } from "type-graphql";
import { Entity, Column } from "typeorm";
import { IsEmail } from "class-validator";

import { BaseUser } from "@api/entity/shared/BaseUser";

@ObjectType()
@Entity()
export class Admin extends BaseUser {
  @Field()
  @IsEmail()
  @Column({ unique: true })
  email: string;
}
