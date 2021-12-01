import { IsNotEmpty, ValidateNested } from 'class-validator';
import { OrderedProductDto } from './ordered-product.dto';
import { Type } from 'class-transformer';

export class OrderCreateDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderedProductDto)
  products!: OrderedProductDto[];
}
