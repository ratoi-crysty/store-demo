import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDetailsDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}
