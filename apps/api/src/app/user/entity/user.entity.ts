import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from '../../order/entity/order.entity';
import { UserModel, UserRole } from '@store-demo/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserEntity implements UserModel {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ readOnly: true, enum: UserRole })
  @Column({ type: 'varchar', length: 10 })
  role!: UserRole;

  @ApiProperty({ readOnly: true })
  @Column({ length: 100, type: 'varchar' })
  name!: string;

  @ApiProperty({ readOnly: true })
  @Column({ length: 100, type: 'varchar', unique: true })
  email!: string;

  @Column({ length: 128, type: 'varchar' })
  password!: string;

  @Column({ length: 20, type: 'varchar' })
  salt!: string;

  @OneToMany(() => OrderEntity, (order: OrderEntity) => order.user)
  orders!: OrderEntity[];

  getPublicData(): UserModel {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }

  toJSON(): UserModel {
    return this.getPublicData();
  }
}
