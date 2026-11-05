export type UserRole = 'customer' | 'admin' | 'super_admin';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
