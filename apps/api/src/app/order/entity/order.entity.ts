import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { OrderedProductModel, OrderModel } from '@store-demo/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class OrderEntity implements OrderModel {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ type: 'simple-json', default: '' })
  products!: OrderedProductModel[];

  @ApiProperty({ readOnly: false })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ readOnly: false })
  @UpdateDateColumn()
  updateAt!: Date;

  @ApiProperty({ required: false, type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.orders)
  user?: UserEntity;
}
