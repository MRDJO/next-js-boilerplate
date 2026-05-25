# Contribuer au boilerplate Starter

Merci de respecter l’architecture du projet. Ce guide s’adresse aux développeurs ; les agents IA peuvent s’appuyer sur le skill `.cursor/skills/implement-feature/`.

## Prérequis

- Node.js 20+
- pnpm

```bash
pnpm install
cp .env.example .env.local   # adapter les variables
pnpm dev
```

## Avant de coder

1. Lire [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) pour la vue d’ensemble.
2. Parcourir la feature **`users`** comme référence (`src/features/users/`).
3. Ne pas introduire de fetch direct dans l’UI ni de logique métier dans `src/app`.

## Ajouter une feature complète

### Checklist

- [ ] Modèle : `types.ts`, `schemas.ts` (Zod), `filters.ts` si liste
- [ ] Repository : interface + impl API + mock + enregistrement DI
- [ ] Service : façade `xService` avec `withSimulatedDelay` si besoin
- [ ] UI : colonnes, table client (`DataTableShell`), card mobile optionnelle
- [ ] Pages : `app/dashboard/<feature>/page.tsx` + `loading.tsx`
- [ ] Navigation : `src/components/layout/sidebar-content.tsx`
- [ ] `pnpm exec tsc --noEmit` et eslint sur les fichiers touchés

### Ordre recommandé

1. **Contrats** — types domaine, filtres, inputs create/update.
2. **Données** — repository mock pour avancer sans API ; puis branchement HTTP.
3. **DI** — `TOKENS` + `container.ts` (oublier cette étape = crash au runtime).
4. **Pages RSC** — `parseXFilters`, `service.list`, composition `HeaderTitle` + table.
5. **Client** — hook URL (`useTransition`), branchement `DataTableShell`.
6. **Finition** — détail `[id]`, formulaires, tests manuels responsive.

### Conventions de code

- **Server Components** par défaut ; `"use client"` uniquement si nécessaire.
- **Exports feature** : uniquement via `features/<nom>/index.ts`.
- **Filtres liste** : toujours synchronisés avec l’URL (`page`, `itemsPerPage`, filtres métier).
- **HTML valide** : pas de `<div>` dans un `<p>` (ex. ne pas mettre `Skeleton` shadcn dans un paragraphe).
- **UI** : réutiliser shadcn (`src/components/ui/`) et les composants `core/table/`.

### Ce qu’il ne faut pas faire

- Appeler `fetch` depuis un composant React de feature.
- Dupliquer un second menu mobile (Sheet **ou** bottom nav, pas les deux).
- Forcer un remount complet de la table à chaque filtre (`key` sur tout le composant) — cela casse l’overlay de filtrage.
- Commiter `.env` ou des secrets.

## Variables d’environnement utiles

| Variable | Description |
|----------|-------------|
| `DATA_PROVIDER` | `mock` ou `real` |
| `AUTH_PROVIDER` | `mock` ou `real` |
| `OTP_ENABLED` | `true` / `false` |
| `NEXT_PUBLIC_SIMULATE_DELAY` | Délai ms pour simuler un réseau lent (tests UX) |

## Qualité

```bash
pnpm exec tsc --noEmit
pnpm exec eslint "src/features/<ta-feature>" "src/app/dashboard/<ta-feature>"
```

## Aide IA (Cursor)

- Skill **projet** (versionnée avec le repo) : `.cursor/skills/implement-feature/`
- Skill **personnel** (tous tes projets) : `~/.cursor/skills/implement-feature/`

Exemple de prompt :

> Implémente la feature Produits en suivant le skill implement-feature et l’architecture docs/ARCHITECTURE.md.

## Questions

En cas de doute sur une brique (table, auth, DI), calquer le comportement sur **users** avant d’inventer un nouveau pattern.
