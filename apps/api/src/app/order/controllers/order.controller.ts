import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrderService } from '../service/order.service';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Crud } from '@nestjsx/crud';
import { OrderEntity } from '../entity/order.entity';

@Controller('order')
@Crud({
  model: {
    type: OrderEntity,
  },
  routes: {
    createOneBase: {

    },
    exclude: []
  },
})
@UseGuards(JwtAuthGuard, AdminGuard)
export class OrderController {
  constructor(protected service: OrderService) {
  }
}
