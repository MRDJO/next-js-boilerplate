"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ActiveFilter } from "@/core/table/data-table.types";
import {
  USER_FILTER_OPTIONS,
  USER_STATUS_LABELS,
} from "../model/user.constants";
import type { ParsedUserFilters } from "../model/user.filters";

const FILTER_META: Record<
  keyof typeof USER_FILTER_OPTIONS,
  { label: string; paramKey: string }
> = {
  status: { label: "Statut", paramKey: "status" },
  role: { label: "Role", paramKey: "role" },
  department: { label: "Departement", paramKey: "department" },
  city: { label: "Ville", paramKey: "city" },
};

export function useUserTableUrl(defaultSearch: string, filters: ParsedUserFilters) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(defaultSearch);

  const replaceParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      params.set("page", "1");
      const query = params.toString();

      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname);
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const trimmed = searchValue.trim();
    const currentSearch = searchParams.get("search") ?? "";

    if (trimmed === currentSearch) {
      return;
    }

    const timeout = window.setTimeout(() => {
      replaceParams({ search: trimmed || null });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [searchValue, searchParams, replaceParams]);

  const onFilterChange = useCallback(
    (key: string, value: string | null) => {
      replaceParams({ [key]: value });
    },
    [replaceParams],
  );

  const onClearFilters = useCallback(() => {
    replaceParams({
      search: null,
      status: null,
      role: null,
      department: null,
      city: null,
    });
    setSearchValue("");
  }, [replaceParams]);

  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const result: ActiveFilter[] = [];

    if (filters.status) {
      result.push({
        key: "status",
        label: FILTER_META.status.label,
        value: filters.status,
        displayValue: USER_STATUS_LABELS[filters.status],
      });
    }

    if (filters.role) {
      result.push({
        key: "role",
        label: FILTER_META.role.label,
        value: filters.role,
        displayValue: filters.role,
      });
    }

    if (filters.department) {
      result.push({
        key: "department",
        label: FILTER_META.department.label,
        value: filters.department,
        displayValue: filters.department,
      });
    }

    if (filters.city) {
      result.push({
        key: "city",
        label: FILTER_META.city.label,
        value: filters.city,
        displayValue: filters.city,
      });
    }

    return result;
  }, [filters]);

  const hasActiveFilters =
    activeFilters.length > 0 || Boolean(filters.search?.trim());

  const activeStatCardId = !filters.status
    ? "total"
    : filters.status === "active"
      ? "active"
      : filters.status === "pending"
        ? "pending"
        : "inactive";

  const filterableColumns = useMemo(
    () =>
      (Object.keys(USER_FILTER_OPTIONS) as Array<keyof typeof USER_FILTER_OPTIONS>).map(
        (key) => ({
          id: key,
          label: FILTER_META[key].label,
          paramKey: FILTER_META[key].paramKey,
          options: [...USER_FILTER_OPTIONS[key]],
        }),
      ),
    [],
  );

  const updatePagination = useCallback(
    (page: number, perPage?: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      if (perPage) {
        params.set("itemsPerPage", String(perPage));
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams],
  );

  return {
    searchValue,
    setSearchValue,
    onFilterChange,
    onClearFilters,
    activeFilters,
    hasActiveFilters,
    activeStatCardId,
    filterableColumns,
    isPending,
    updatePagination,
  };
}
