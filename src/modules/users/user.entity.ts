export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

export interface User {
  id: string;

  name: string;

  email: string;

  password: string;

  role: UserRole;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}
