import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class PhoneSessionInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  sessionInfo: string;

  @Column()
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;
}
