import { IsNotEmpty, IsOptional } from 'class-validator';
import { LoginRequest } from '@store-demo/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class LoginCredentialsDto implements LoginRequest {
  @ApiProperty()
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  rememberMe?: boolean;
}
