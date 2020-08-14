import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PhoneSessionInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  sessionInfo: string;

  @Column()
  phoneNumber: string;
}
