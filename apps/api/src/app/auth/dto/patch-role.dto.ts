import { IsEnum, IsNotEmpty } from "class-validator";
import { PatchRoleRequest, UserRole } from "@store-demo/api-interfaces";
import { ApiProperty } from "@nestjs/swagger";

export class PatchRoleDto implements PatchRoleRequest {
  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty()
  @IsNotEmpty()
  currentPassword!: string;
}
