import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../model/user.model';
import { OrderEntity } from '../../order/entity/order.entity';

export enum UserEntityRole {
  Admin = 'Admin',
  User = 'User',
}

@Entity()
export class UserEntity implements UserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 10 })
  role!: UserEntityRole;

  @Column({ length: 100, type: 'varchar' })
  name!: string;

  @Column({ length: 100, type: 'varchar', unique: true })
  email!: string;

  @Column({ length: 128, type: 'varchar' })
  password!: string;

  @Column({ length: 20, type: 'varchar' })
  salt!: string;

  @OneToMany(() => OrderEntity, (order: OrderEntity) => order.user)
  orders!: OrderEntity[];

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
