import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([OrderEntity])],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
