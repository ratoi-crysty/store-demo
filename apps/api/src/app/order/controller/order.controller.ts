import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrderService } from '../service/order.service';
import { getSessionUser } from '../../auth/utils/session.utils';
import { AppRequest } from '../../auth/types/app-request';
import { UserEntity } from '../../user/entity/user.entity';
import { OrderCreateDto } from '../dto/order-create.dto';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(protected orderService: OrderService) {
  }

  @Get()
  list(@Req() req: AppRequest) {
    const user: UserEntity = getSessionUser(req);

    return this.orderService.repo.find({ where: { user } });
  }

  @Post()
  create(@Req() req: AppRequest, @Body() body: OrderCreateDto): unknown {
    const user: UserEntity = getSessionUser(req);

    return this.orderService.create(user, body.products);
  }
}
