import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderedProductModel } from '../models/ordered-product.model';
import { UserEntity } from '../../user/entity/user.entity';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;

  @Column({ type: 'simple-json', default: '' })
  products!: OrderedProductModel[];

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.orders)
  user!: UserEntity;
}
