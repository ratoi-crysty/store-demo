export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

export interface UserModel {
  id: number;
  role: UserRole;
  name: string;
  email: string;
}
