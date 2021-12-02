import { UserRole } from '../../models/user.model';

export interface PatchRoleRequest {
  role: UserRole;
  currentPassword: string;
}
