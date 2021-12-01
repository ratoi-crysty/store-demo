import { IsNotEmpty } from 'class-validator';

export class PatchPasswordDto {
  @IsNotEmpty()
  password!: string;
}
