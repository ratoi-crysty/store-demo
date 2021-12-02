import { IsEmail, IsNotEmpty } from 'class-validator';
import { RegisterRequest } from '@store-demo/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDetailsDto implements RegisterRequest {
  @ApiProperty()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  password!: string;
}
