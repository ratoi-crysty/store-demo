import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { OrderedProductModel } from '@store-demo/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class OrderedProductDto implements Omit<OrderedProductModel, 'image'> {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  count!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price!: number;
}
