import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm";

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

  @DeleteDateColumn()
  deletedAt?: Date;
}
