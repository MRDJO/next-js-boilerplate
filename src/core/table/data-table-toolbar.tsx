"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps {
  searchPlaceholder?: string;
  searchParamKey?: string;
  defaultValue?: string;
  children?: React.ReactNode;
}

export function DataTableToolbar({
  searchPlaceholder = "Rechercher...",
  searchParamKey = "search",
  defaultValue = "",
  children,
}: DataTableToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const trimmed = value.trim();
    const currentSearch = searchParams.get(searchParamKey) ?? "";

    if (trimmed === currentSearch) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (trimmed) {
        params.set(searchParamKey, trimmed);
      } else {
        params.delete(searchParamKey);
      }

      params.set("page", "1");

      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname);
      });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [value, pathname, router, searchParamKey]);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
          aria-busy={isPending}
        />
      </div>
      <div className="flex items-center gap-2">
        {children}
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => {
            setValue("");
            const params = new URLSearchParams(searchParams.toString());
            params.delete(searchParamKey);
            params.delete("page");
            const query = params.toString();
            startTransition(() => {
              router.replace(query ? `${pathname}?${query}` : pathname);
            });
          }}
        >
          <SlidersHorizontal className="size-4" />
          Reinitialiser
        </Button>
      </div>
    </div>
  );
}
