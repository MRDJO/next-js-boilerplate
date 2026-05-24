import type { CrudListParams } from "@/core/repositories/crud.types";
import type { UserFilters, UserStatus } from "./user.types";

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

export interface ParsedUserFilters extends CrudListParams<UserFilters> {
  page: number;
  perPage: number;
  search: string;
  status?: UserStatus;
  role?: string;
  department?: string;
  city?: string;
}

const parseNumber = (value: string | string[] | undefined, fallback: number) => {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseString = (value: string | string[] | undefined) => {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
};

const parseStatus = (value: string | string[] | undefined): UserStatus | undefined => {
  const status = parseString(value);
  if (status === "active" || status === "inactive" || status === "pending") {
    return status;
  }
  return undefined;
};

export const parseUserFilters = async (
  searchParams: SearchParamsInput,
): Promise<ParsedUserFilters> => {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const role = parseString(params.role) || undefined;
  const department = parseString(params.department) || undefined;
  const city = parseString(params.city) || undefined;

  return {
    page: parseNumber(params.page, 1),
    perPage: parseNumber(params.itemsPerPage, 10),
    search: parseString(params.search),
    status,
    role,
    department,
    city,
  };
};
