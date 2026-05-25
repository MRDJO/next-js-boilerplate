---
name: implement-feature
description: >-
  Implémente une feature complète dans le boilerplate Next.js Starter (repository,
  service, pages App Router, UI DataTable, navigation). À utiliser quand l'utilisateur
  demande une nouvelle feature, un module CRUD, une page dashboard, ou de suivre
  l'architecture du projet scrupuleusement.
---

# Implémenter une feature complète (Starter Boilerplate)

Guide obligatoire pour toute nouvelle feature métier. **Ne pas improviser l'architecture** : copier le pattern `users` et les socles `core/`.

## Règles absolues

1. **Pas de fetch direct dans les composants UI** — passer par `service` → `repository`.
2. **Pas de logique métier dans `src/app`** — uniquement routing, layout, composition.
3. **Server Components par défaut** pour les pages ; `"use client"` seulement pour interactivité (table, formulaires, hooks URL).
4. **DI Inversify** — enregistrer chaque nouveau repository dans `container.ts` + `tokens.ts`.
5. **Exports publics** via `src/features/<feature>/index.ts` uniquement.
6. **shadcn/ui** pour l'UI — ne pas réinventer Button, Dialog, etc.
7. **Filtres liste = URL search params** + `parseXFilters` + `useTransition` côté client (voir `use-user-table-url.ts`).
8. **Ne pas mélanger HTML invalide** — pas de `<div>` dans `<p>` (ex. Skeleton dans un paragraphe).

## Arborescence cible

```
src/features/<feature>/
├── api/<feature>.api.ts           # constantes endpoints
├── model/
│   ├── <feature>.types.ts         # entités, DTO, filters, inputs
│   ├── <feature>.schemas.ts       # Zod (formulaires)
│   ├── <feature>.mapper.ts        # DTO → domaine (si API réelle)
│   ├── <feature>.filters.ts       # parseSearchParams → ParsedFilters
│   ├── <feature>.constants.ts     # options filtres, labels (optionnel)
│   └── <feature>.mock-data.ts     # si mock
├── repository/
│   ├── <feature>.repository.interface.ts
│   ├── <feature>.repository.ts      # API (extends BaseCrudRepository)
│   └── <feature>.repository.mock.ts
├── service/<feature>.service.ts   # façade fine, getAppContainer()
├── hooks/                         # hooks client URL / UI (optionnel)
├── ui/
│   ├── <feature>-columns.tsx
│   ├── <feature>-table.tsx        # branche DataTableShell
│   ├── <feature>-card.tsx         # si vue mobile carte
│   └── ...
└── index.ts                       # exports publics

src/app/dashboard/<feature>/
├── page.tsx                       # Server Component, fetch service
├── loading.tsx                    # skeleton (StatCards + DataTable)
└── [id]/page.tsx                  # détail (optionnel)
```

Socles partagés (ne pas dupliquer) :

| Besoin | Emplacement |
|--------|-------------|
| Tableau, filtres, stats, bulk | `src/core/table/` (`DataTableShell`, toolbar, pills…) |
| Layout dashboard | `src/app/dashboard/_components/`, `src/components/layout/` |
| CRUD HTTP | `src/core/repositories/base-crud.repository.ts` |
| Auth server | `src/core/auth/server.ts`, `auth.actions.ts` |
| Config | `src/lib/config.ts` (`DASHBOARDSTARTPATH`), `src/core/config/env.ts` |

## Workflow (checklist)

Copier et cocher :

```
- [ ] 1. Modèle & contrats
- [ ] 2. Repository (+ mock) + DI
- [ ] 3. Service
- [ ] 4. parseFilters + constantes filtres
- [ ] 5. Colonnes + table client + card (si liste)
- [ ] 6. Page liste (RSC) + loading.tsx
- [ ] 7. Page détail / formulaires (si besoin)
- [ ] 8. Navigation sidebar
- [ ] 9. Lint + tsc + test manuel
```

### 1. Modèle & contrats

- `types.ts` : entité domaine, `XFilters`, `CreateXInput`, `UpdateXInput`, `XDto` si API.
- `schemas.ts` : Zod pour formulaires (`createXSchema`, `updateXSchema.partial()`).
- Stats dédiées si cards en haut : `XStatsSummary` + méthode `getStats()` sur le repository.

### 2. Repository & DI

**Interface** — étend `CrudRepository` + méthodes spécifiques :

```ts
export interface IProductRepository
  extends CrudRepository<Product, CreateProductInput, UpdateProductInput, ProductFilters> {
  getStats(): Promise<ProductStatsSummary>; // si stat cards
}
```

**API** — `ProductRepository` extends `BaseCrudRepository` avec `buildListQuery` mappant **tous** les filtres URL :

```ts
if (filters?.search) params.set("search", filters.search);
if (filters?.status) params.set("status", filters.status);
```

**Mock** — données en mémoire, `applyFilters()` avant pagination, `getStats()` sur jeu complet.

**DI** (`src/core/di/tokens.ts` + `container.ts`) :

```ts
// tokens.ts
ProductRepository: Symbol.for("ProductRepository"),

// container.ts — bindData()
if (featureFlags.useMockData) {
  container.bind(TOKENS.ProductRepository).to(MockProductRepository).inSingletonScope();
} else {
  container.bind(TOKENS.ProductRepository).to(ProductRepository).inSingletonScope();
}
```

### 3. Service

Façade statique (comme `user.service.ts`) :

```ts
export const productService = {
  list: (filters?) => withSimulatedDelay(() => getRepo().list(filters)),
  getStats: () => withSimulatedDelay(() => getRepo().getStats()),
  getById: (id) => getRepo().getById(id),
};
```

Utiliser `withSimulatedDelay` de `@/lib/simulate-delay` si tests UX (`NEXT_PUBLIC_SIMULATE_DELAY`).

### 4. Filtres URL

`model/<feature>.filters.ts` :

- `ParsedXFilters extends CrudListParams<XFilters>` avec `page`, `perPage`, champs filtre.
- `parseXFilters(searchParams: Promise<Record<...>>)` — **async**, lire `page`, `itemsPerPage`, filtres.

Côté client : hook `use-x-table-url.ts` avec `useTransition`, debounce search 350ms, `replaceParams` remet `page=1`.

### 5. UI liste

**Colonnes** (`ui/x-columns.tsx`) — `ColumnDef<X>[]`, tailles explicites, `enableHiding` implicite.

**Table client** (`ui/x-table.tsx`) :

```tsx
<DataTableShell
  columns={xColumns}
  data={items}
  getRowId={(row) => String(row.id)}
  onRowClick={(row) => router.push(`/dashboard/x/${row.id}`)}
  enableRowSelection
  enableColumnVisibility
  statCards={...}
  activeStatCardId={...}
  onStatCardClick={...}
  filterableColumns={...}
  activeFilters={...}
  onFilterChange={...}
  onClearFilters={...}
  hasActiveFilters={...}
  isFiltering={isPending}
  totalUnfilteredCount={stats.total}
  totalItems={total}
  entityLabel="produit"
  pagination={{ currentPage, perPage, totalItems, onPageChange, onItemPerPageChange }}
  cardComponent={XCard}  // optionnel — active vue carte mobile
/>
```

**Ne pas** remonter tout `UserTable` avec un `key` sur les filtres — ça casse l'overlay `isFiltering`.

### 6. Page liste (Server Component)

```tsx
const filters = await parseXFilters(searchParams);
const [list, stats] = await Promise.all([
  xService.list(filters),
  xService.getStats(),
]);

return (
  <div className="flex min-h-0 min-w-0 flex-col gap-6">
    <HeaderTitle title="..." description="..." />
    <XTable items={list.items} total={list.total} stats={stats} filters={filters} />
  </div>
);
```

**`loading.tsx`** à côté : `DataTableStatCardsSkeleton` + `DataTableSkeleton`.

### 7. Détail & mutations

- Détail : RSC `getById`, `notFound()` dans catch, `HeaderTitle` + contenu.
- Mutations : **Server Actions** dans `features/<feature>/actions/` ou réutiliser pattern auth — pas de POST depuis le client hors actions.
- Formulaires : composants `src/components/form/*` + `react-hook-form` + schémas Zod.

### 8. Navigation

Mettre à jour **`src/components/layout/sidebar-content.tsx`** (`navItems`) :

- Section + item avec `href`, `icon`, `disabled: true` + badge `soon` pour features non prêtes.
- Actif : utiliser `isNavItemActive` — `/dashboard` exact pour l'accueil, `startsWith` pour les sous-routes.

Mobile : Sheet réutilise `SidebarContent` — pas de second menu.

### 9. Validation finale

```bash
pnpm exec tsc --noEmit
pnpm exec eslint "src/features/<feature>" "src/app/dashboard/<feature>"
```

Vérifier : filtres URL, pills colorées, overlay filtrage, pagination, export CSV, responsive carte mobile.

## DataTableShell — props essentielles

| Prop | Usage |
|------|--------|
| `isFiltering` | `isPending` du `useTransition` |
| `hasActiveFilters` | search ou pills actifs |
| `totalUnfilteredCount` | total global (stats) vs `totalItems` filtré |
| `cardComponent` | vue carte mobile + toggle desktop |
| `statCards` / `onStatCardClick` | cards cliquables → filtre URL |

Compteur : `DataTableResultsCount` — **jamais** de `Skeleton` (div) dans un `<p>`.

## Auth & routes protégées

- Layout dashboard : `getAuthService().getCurrentUser()` → `redirect("/login")`.
- `src/proxy.ts` : routes sous `DASHBOARDSTARTPATH` protégées par cookie `access_token`.
- Déconnexion : `logoutAction()` depuis `UserAccountMenu` ou footer sidebar.

## Anti-patterns (interdits)

- ❌ Appeler `fetch("/api/...")` dans un composant page ou UI feature
- ❌ Mettre des types métier dans `src/components`
- ❌ Dupliquer la logique de pagination/filtre hors URL pour les listes dashboard
- ❌ Créer un second système de sidebar (bottom nav + sheet simultanés)
- ❌ Ignorer `loading.tsx` pour les pages liste lourdes
- ❌ Oublier le bind DI (erreur runtime silencieuse au premier `get()`)

## Référence complète

Templates de fichiers, exemple Users fil par fil : [reference.md](reference.md)

Feature pilote à lire en priorité : `src/features/users/`.

Documentation humaine (même contenu, lecture équipe) : `docs/ARCHITECTURE.md`, `CONTRIBUTING.md`.
