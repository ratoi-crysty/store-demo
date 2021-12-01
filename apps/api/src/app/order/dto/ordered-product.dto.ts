import { OrderedProductModel } from '../models/ordered-product.model';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class OrderedProductDto implements Omit<OrderedProductModel, 'image'> {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  count!: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;
}
