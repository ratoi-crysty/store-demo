import { Body, Controller, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AppRequest } from '../../auth/types/app-request';
import { UserEntity } from '../../user/entity/user.entity';
import { getSessionUser } from '../../auth/utils/session.utils';
import { OrderCreateDto } from '../dto/order-create.dto';
import { OrderService } from '../service/order.service';
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderEntity } from '../entity/order.entity';

@ApiTags('UserOrder')
@Controller('user-order')
@UseGuards(JwtAuthGuard)
export class UserOrderController {
  constructor(protected service: OrderService) {
  }

  @Get()
  @ApiResponse({
    isArray: true,
    type: () => OrderEntity,
  })
  list(@Req() req: AppRequest) {
    const user: UserEntity = getSessionUser(req);

    return this.service.repo.find({ where: { user } });
  }

  @Get(':id')
  @ApiResponse({
    type: () => OrderEntity,
  })
  async item(@Param('id') id: string, @Req() req: AppRequest): Promise<OrderEntity> {
    const order: OrderEntity | undefined = await this.service.findOne(+id, {
      relations: ['user'],
    });

    const user = getSessionUser(req);

    if (!order || order.user?.id !== user.id) {
      throw new NotFoundException('Order not found!');
    }

    delete order.user;

    return order;
  }

  @Post()
  @ApiResponse({
    type: () => OrderEntity,
  })
  create(@Req() req: AppRequest, @Body() body: OrderCreateDto): Promise<OrderEntity> {
    const user: UserEntity = getSessionUser(req);

    return this.service.create(user, body.products);
  }
}
