import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderController } from './controllers/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { ProductModule } from '../product/product.module';
import { UserOrderController } from './controllers/user-order.controller';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([OrderEntity])],
  providers: [OrderService],
  controllers: [OrderController, UserOrderController]
})
export class OrderModule {}
