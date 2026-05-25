# Référence — Feature `users` (feature pilote)

## Fichiers modèles à lire

| Fichier | Rôle |
|---------|------|
| `src/features/users/model/user.types.ts` | Entité, filters, stats |
| `src/features/users/model/user.filters.ts` | `parseUserFilters` |
| `src/features/users/model/user.constants.ts` | Options dropdown filtres |
| `src/features/users/repository/user.repository.interface.ts` | Contrat |
| `src/features/users/repository/user.repository.ts` | HTTP + `buildListQuery` |
| `src/features/users/repository/user.repository.mock.ts` | Mock + `applyFilters` |
| `src/features/users/service/user.service.ts` | Façade |
| `src/features/users/hooks/use-user-table-url.ts` | URL + transition |
| `src/features/users/ui/user-columns.tsx` | TanStack columns |
| `src/features/users/ui/user-table.tsx` | `DataTableShell` |
| `src/features/users/ui/user-card.tsx` | Vue carte mobile |
| `src/app/dashboard/users/page.tsx` | RSC liste |
| `src/app/dashboard/users/loading.tsx` | Skeleton initial |
| `src/app/dashboard/users/[id]/page.tsx` | RSC détail |

## Template — `parseXFilters`

```ts
import type { CrudListParams } from "@/core/repositories/crud.types";
import type { XFilters } from "./x.types";

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

export interface ParsedXFilters extends CrudListParams<XFilters> {
  page: number;
  perPage: number;
  search: string;
  // + champs filtre typés
}

const parseNumber = (value: string | string[] | undefined, fallback: number) => {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseString = (value: string | string[] | undefined) =>
  Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

export const parseXFilters = async (searchParams: SearchParamsInput): Promise<ParsedXFilters> => ({
  page: parseNumber((await searchParams).page, 1),
  perPage: parseNumber((await searchParams).itemsPerPage, 10),
  search: parseString((await searchParams).search),
  // status: parseStatus(...),
});
```

## Template — Repository HTTP

```ts
@injectable()
export class XRepository
  extends BaseCrudRepository<X, CreateXInput, UpdateXInput, XFilters, XDto>
  implements IXRepository
{
  constructor(@inject(TOKENS.ApiClient) client: ApiClient) {
    super(client, {
      endpoint: X_ENDPOINT,
      mapOne: mapXDtoToX,
      mapMany: (items) => items.map(mapXDtoToX),
      buildListQuery: (filters) => {
        const params = new URLSearchParams();
        params.set("page", String(filters?.page ?? 1));
        params.set("itemsPerPage", String(filters?.perPage ?? 10));
        if (filters?.search) params.set("search", filters.search);
        return `?${params.toString()}`;
      },
      extractList: (response, filters) => extractXList(response, filters),
    });
  }

  async getStats(): Promise<XStatsSummary> {
    return this.client.get<XStatsSummary>(`${X_ENDPOINT}/stats`);
  }
}
```

## Template — Mock repository

```ts
@injectable()
export class MockXRepository implements IXRepository {
  private items = generateMockX(50);

  private applyFilters(filters?: CrudListParams<XFilters>) {
    return this.items.filter((item) => {
      // status, role, search.includes(...)
      return true;
    });
  }

  async list(filters?: CrudListParams<XFilters>) {
    const page = filters?.page ?? 1;
    const perPage = filters?.perPage ?? 10;
    const filtered = this.applyFilters(filters);
    const start = (page - 1) * perPage;
    return {
      items: filtered.slice(start, start + perPage),
      total: filtered.length,
      page,
      perPage,
    };
  }

  async getStats() {
    return { total: this.items.length /* ... */ };
  }
  // getById, create, update, delete...
}
```

## Template — Hook URL client

```ts
"use client";

export function useXTableUrl(defaultSearch: string, filters: ParsedXFilters) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(defaultSearch);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchValue(defaultSearch);
  }, [defaultSearch]);

  const replaceParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.set("page", "1");
    startTransition(() => {
      router.replace(params.toString() ? `${pathname}?${params}` : pathname);
    });
  }, [pathname, router, searchParams]);

  // debounce search 350ms → replaceParams({ search })
  // build activeFilters, filterableColumns, activeStatCardId

  return { searchValue, setSearchValue, onFilterChange, onClearFilters, isPending, /* ... */ };
}
```

## Template — Stat cards config

```ts
const statCards: StatCard[] = [
  {
    id: "total",
    label: "Total",
    value: stats.total,
    description: "enregistres",
    icon: Package,
  },
  {
    id: "active",
    label: "Actifs",
    value: stats.active,
    description: "disponibles",
    icon: Check,
    accent: "emerald",
    filterKey: "status",
    filterValue: "active",
  },
];

const handleStatCardClick = (card: StatCard) => {
  if (card.id === "total") {
    onFilterChange("status", null);
    return;
  }
  const isActive = filters.status === card.filterValue;
  onFilterChange(card.filterKey!, isActive ? null : card.filterValue!);
};
```

## Template — Sidebar nav item

Dans `sidebar-content.tsx`, ajouter dans `navItems` :

```ts
{
  section: "Fonctionnalites",
  items: [
    // existants...
    { label: "Produits", icon: Package, href: `${DASHBOARDSTARTPATH}/products`, disabled: false },
  ],
},
```

Item « soon » : `disabled: true` — le composant `SidebarNavItem` affiche le badge.

## Variables d'environnement

| Variable | Effet |
|----------|--------|
| `DATA_PROVIDER=mock` | Repositories mock |
| `AUTH_PROVIDER=mock` | Auth mock |
| `NEXT_PUBLIC_SIMULATE_DELAY=1500` | Délai sur `list` / `getStats` |

## Couches — qui appelle qui

```
page.tsx (RSC)
  → xService.list / getStats
    → getAppContainer().get<IXRepository>(TOKENS.XRepository)
      → MockXRepository | XRepository

x-table.tsx (client)
  → DataTableShell (props données + callbacks URL)
  → useXTableUrl → router.replace + useTransition → isFiltering

layout dashboard
  → getAuthService().getCurrentUser()
  → DashboardShell → Sidebar + Header
```

## index.ts — exports typiques

```ts
export * from "./model/x.filters";
export * from "./service/x.service";
export * from "./ui/x-table";
// Ne pas exporter repository / mock (internes)
```
