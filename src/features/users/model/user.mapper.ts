import type { PaginatedResult } from "@/core/repositories/crud.types";
import type { User, UserDto } from "./user.types";

interface ApiPaginatedResponse<T> {
  meta?: {
    total?: number;
    currentPage?: number;
    perPage?: number;
  };
  data?: T[];
}

export const mapUserDtoToUser = (dto: UserDto): User => ({
  id: dto.id,
  employeeId: dto.employeeId,
  fullName: dto.fullName,
  username: dto.username,
  email: dto.email,
  phone: dto.phone,
  role: dto.role,
  department: dto.department,
  jobTitle: dto.jobTitle,
  city: dto.city,
  country: dto.country,
  manager: dto.manager,
  contractType: dto.contractType,
  salaryBand: dto.salaryBand,
  status: dto.status,
  lastLoginAt: dto.lastLoginAt,
  createdAt: dto.createdAt,
});

export const extractUsersList = (
  response: unknown,
  defaults?: { page?: number; perPage?: number }
): PaginatedResult<UserDto> => {
  const payload = response as ApiPaginatedResponse<UserDto>;

  return {
    items: payload.data ?? [],
    total: payload.meta?.total ?? 0,
    page: payload.meta?.currentPage ?? defaults?.page ?? 1,
    perPage: payload.meta?.perPage ?? defaults?.perPage ?? 10,
  };
};
