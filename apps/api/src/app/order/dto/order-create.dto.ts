import { IsNotEmpty, ValidateNested } from 'class-validator';
import { OrderedProductDto } from './ordered-product.dto';
import { Type } from 'class-transformer';
import { OrderCreateRequest } from '@store-demo/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class OrderCreateDto implements OrderCreateRequest {
  @ApiProperty({ isArray: true, type: () => OrderedProductDto })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderedProductDto)
  products!: OrderedProductDto[];
}
