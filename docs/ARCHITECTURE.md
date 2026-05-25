# Architecture — Next.js Starter Boilerplate

Ce document décrit l’architecture du projet pour les développeurs. Pour implémenter une feature pas à pas, voir [CONTRIBUTING.md](../CONTRIBUTING.md).

## Vue d’ensemble

Application **Next.js 16 (App Router)** avec dashboard protégé, auth par cookie, et features métier isolées sous `src/features/`.

```
┌─────────────────────────────────────────────────────────────┐
│  src/app          Routes, layouts, pages (composition)     │
│  src/features     Logique métier par domaine (users, …)    │
│  src/core         Socles transverses (auth, table, http, DI) │
│  src/components   UI réutilisable (shadcn, layout, form)   │
│  src/lib / hooks  Utilitaires partagés                       │
└─────────────────────────────────────────────────────────────┘
```

## Couches de données

Le flux est toujours le même :

```
Page (Server Component)
    → service (façade)
        → repository (interface)
            → implémentation API ou mock
```

- **Pas de `fetch` dans les composants UI.**
- **Pas de logique métier dans `src/app`** — seulement chargement des données et composition.

### Injection de dépendances (Inversify)

Fichiers : `src/core/di/tokens.ts`, `src/core/di/container.ts`.

Le provider (`mock` / `real`) est choisi via `.env` :

| Variable | Effet |
|----------|--------|
| `DATA_PROVIDER=mock` | Repositories et API client mock |
| `DATA_PROVIDER=real` | Implémentations HTTP |
| `AUTH_PROVIDER=mock` | Auth mock (OTP `123456`) |
| `AUTH_PROVIDER=real` | Auth cookie / backend |

Chaque nouveau repository doit être enregistré dans `TOKENS` et `bindData()` (ou `bindAuth()`).

## Structure d’une feature

Référence : **`src/features/users/`**.

```
features/<nom>/
├── api/              Endpoints (constantes)
├── model/            Types, Zod, filtres URL, mapper, mocks
├── repository/       Interface + API + mock
├── service/          Façade appelée par les pages
├── hooks/            Logique client (URL, UI) si besoin
├── ui/               Composants feature (table, colonnes, card…)
└── index.ts          Exports publics uniquement
```

Pages associées :

```
app/dashboard/<nom>/
├── page.tsx          Liste (RSC)
├── loading.tsx       Skeleton premier chargement
└── [id]/page.tsx     Détail (optionnel)
```

## Listes dashboard : filtres et tableau

### Filtres via URL

Les listes utilisent les **search params** comme source de vérité (`?page=1&search=…&status=active`).

- Côté serveur : `parseXFilters(searchParams)` dans `model/<feature>.filters.ts`.
- Côté client : hook dédié (ex. `use-user-table-url.ts`) avec `useTransition` pour les mises à jour sans vider l’écran.

### DataTable (`src/core/table/`)

Composant principal : **`DataTableShell`**.

Fonctionnalités fournies :

- Stat cards cliquables (filtre statut, etc.)
- Toolbar (recherche, filtres, colonnes, export, toggle vue carte)
- Pills de filtres actifs (couleurs par type)
- Tableau TanStack (sélection, colonnes masquables, scroll)
- Vue carte mobile si `cardComponent` est fourni
- Pagination, bulk bar, états vides et overlay « filtrage en cours »

La feature ne fait que brancher ses colonnes, données et callbacks URL.

## UI et layout

| Zone | Emplacement |
|------|-------------|
| Composants shadcn | `src/components/ui/` |
| Formulaires | `src/components/form/` |
| Sidebar desktop | `src/components/layout/sidebar.tsx` |
| Menu mobile | `src/components/layout/mobile-sheet-nav.tsx` (Sheet) |
| Shell dashboard | `src/app/dashboard/_components/dashboard-shell.tsx` |

Navigation : modifier **`sidebar-content.tsx`** (`navItems`) pour chaque nouvelle entrée de menu.

## Authentification

- **Middleware** : `src/proxy.ts` — routes `/dashboard/*` protégées par cookie `access_token`.
- **Layout dashboard** : vérifie l’utilisateur courant, redirige vers `/login` si absent.
- **Actions serveur** : `src/core/auth/auth.actions.ts` (`loginAction`, `logoutAction`, …).
- **Côté serveur dans les pages** : `getAuthService()` depuis `src/core/auth/server.ts`.

## Configuration

- `src/lib/config.ts` — `DASHBOARDSTARTPATH` (`/dashboard`).
- `src/core/config/env.ts` — variables d’environnement typées.
- `NEXT_PUBLIC_SIMULATE_DELAY` — délai artificiel (ms) pour tester skeletons et overlays (0 = désactivé).

## Tests

```
tests/
├── unit/           Tests unitaires
└── integration/    Tests d’intégration
```

## Pour aller plus loin

- Feature pilote : `src/features/users/`
- Guide contribution : [CONTRIBUTING.md](../CONTRIBUTING.md)
- Skill agent Cursor (projet) : `.cursor/skills/implement-feature/`
