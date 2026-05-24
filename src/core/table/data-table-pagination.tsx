"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PaginationControls } from "./pagination-controls";

interface DataTablePaginationProps {
  currentPage: number;
  perPage: number;
  totalItems: number;
}

export function DataTablePagination({
  currentPage,
  perPage,
  totalItems,
}: DataTablePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <PaginationControls
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      itemsPerPage={perPage}
      loading={false}
      onPageChange={(page) => updateParam("page", String(page))}
      onItemPerPageChange={(value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("itemsPerPage", String(value));
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      }}
    />
  );
}
