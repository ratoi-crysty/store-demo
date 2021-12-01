import { IsNotEmpty, IsOptional } from 'class-validator';

export class LoginCredentialsDto {
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsOptional()
  rememberMe?: boolean;
}
