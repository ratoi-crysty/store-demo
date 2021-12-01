import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserEntityRole } from '../../user/entity/user.entity';

export class PatchRoleDto {
  @IsNotEmpty()
  @IsEnum(UserEntityRole)
  role!: UserEntityRole;

  @IsNotEmpty()
  currentPassword!: string;
}
