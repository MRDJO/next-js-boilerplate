export type UserStatus = "active" | "inactive" | "pending";

export interface UserRole {
  id: number;
  name: string;
}

export interface User {
  id: number;
  employeeId: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  jobTitle: string;
  city: string;
  country: string;
  manager: string;
  contractType: string;
  salaryBand: string;
  status: UserStatus;
  lastLoginAt: string;
  createdAt: string;
}

export interface UserDto {
  id: number;
  employeeId: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  jobTitle: string;
  city: string;
  country: string;
  manager: string;
  contractType: string;
  salaryBand: string;
  status: UserStatus;
  lastLoginAt: string;
  createdAt: string;
}

export interface CreateUserInput {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  roleId: number;
}

export type UpdateUserInput = Partial<CreateUserInput>;

export interface UserFilters {
  search?: string;
  status?: UserStatus;
  role?: string;
  department?: string;
  city?: string;
}

export interface UserStatsSummary {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}
