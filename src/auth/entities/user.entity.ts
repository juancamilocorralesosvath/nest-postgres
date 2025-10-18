import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column('text')
  fullName: string;

  @Column('text')
  // por que password es opcional?
  password?: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column({
    type: 'text',
    array: true,
    default: ['teacher'],
  })
  roles: string[];

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBeforeChanges() {
    this.email = this.email.toLowerCase().trim();
  }
}
