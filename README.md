# Next.js Boilerplate

This is a Next.js boilerplate for building modern web applications, with a focus on dashboard-style interfaces. It comes pre-configured with a set of tools and conventions to help you get started quickly.

## Architecture

Architecture **feature-based** (App Router) : `service` → `repository`, DI Inversify, listes dashboard avec filtres URL et `DataTableShell`.

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — vue d’ensemble pour les développeurs
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — comment ajouter une feature
- **Référence code** : `src/features/users/`
- **Skill Cursor (agent)** : `.cursor/skills/implement-feature/`

| Dossier | Rôle |
|---------|------|
| `src/app` | Routes, layouts, pages |
| `src/features` | Logique métier par domaine |
| `src/core` | Auth, HTTP, table, repositories, DI |
| `src/components` | UI shadcn, layout, formulaires |

## Components

The project uses [shadcn/ui](https://ui.shadcn.com/) for its component library. The following components are available in `src/components/ui`:

*   avatar
*   breadcrumb
*   button
*   calendar
*   card
*   collapsible
*   command
*   country-dropdown
*   date-picker
*   dialog
*   dropdown-menu
*   dropdownsearch_component
*   form
*   input
*   label
*   password-input
*   phone-input
*   popover
*   scroll-area
*   select
*   separator
*   sheet
*   sidebar
*   skeleton
*   sonner
*   switch
*   table
*   textarea
*   tooltip

## Key Dependencies

*   [Next.js](https://nextjs.org/)
*   [React](https://reactjs.org/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [shadcn/ui](https://ui.shadcn.com/)
*   [Zustand](https://github.com/pmndrs/zustand) (State Management)
*   [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) (Form Handling & Validation)
*   [Lucide React](https://lucide.dev/) (Icons)

## Getting Started

1.  **Install dependencies:**

    ```bash
    pnpm install
    ```
2. **Setup the .env variable**

    ```bash
    NEXTBACKEND_URL=http://localhost:3333/api/v1/
    ```

3.  **Run the development server:**

    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.
