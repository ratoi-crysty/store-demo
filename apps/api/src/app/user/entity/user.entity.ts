import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../model/user.model';

export enum UserEntityRole {
  Admin,
  User,
}

@Entity()
export class UserEntity implements UserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'smallint' })
  role!: UserEntityRole;

  @Column({ length: 100, type: 'varchar' })
  name!: string;

  @Column({ length: 100, type: 'varchar', unique: true })
  email!: string;

  @Column({ length: 128, type: 'varchar' })
  password!: string;

  @Column({ length: 20, type: 'varchar' })
  salt!: string;

  getPublicData() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }

  toJSON(): UserModel {
    return this.getPublicData();
  }
}
