import type { CrudListParams } from "@/core/repositories/crud.types";
import type { UserFilters } from "./user.types";

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

export interface ParsedUserFilters extends CrudListParams<UserFilters> {
  page: number;
  perPage: number;
  search: string;
}

const parseNumber = (
  value: string | string[] | undefined,
  fallback: number
) => {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseString = (value: string | string[] | undefined) => {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
};

export const parseUserFilters = async (
  searchParams: SearchParamsInput
): Promise<ParsedUserFilters> => {
  const params = await searchParams;

  return {
    page: parseNumber(params.page, 1),
    perPage: parseNumber(params.itemsPerPage, 10),
    search: parseString(params.search),
  };
};
