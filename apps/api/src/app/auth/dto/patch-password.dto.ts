import { IsNotEmpty } from 'class-validator';
import { PatchPasswordRequest } from '@store-demo/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class PatchPasswordDto implements PatchPasswordRequest {
  @ApiProperty()
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty()
  @IsNotEmpty()
  newPassword!: string;
}
