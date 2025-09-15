# Next.js Boilerplate

This is a Next.js boilerplate for building modern web applications, with a focus on dashboard-style interfaces. It comes pre-configured with a set of tools and conventions to help you get started quickly.

## Architecture

The project follows a feature-based architecture using the Next.js App Router.

*   **`src/app`**: This directory contains the application's routes, layouts, and pages, following the Next.js App Router conventions.
*   **`src/components`**: This directory is for all React components, organized into `ui` for generic, reusable components (from shadcn/ui) and other custom components.
*   **`src/features`**: This is where the core business logic resides. It's divided by feature (e.g., `app`, `user`), with each feature having its own actions, queries, data models, and state management.
*   **`src/lib`**: This directory contains shared utilities and library configurations.
*   **`src/hooks`**: This directory is for custom React hooks.

## Data Fetching

Data fetching is handled through a centralized system in the `src/features` directory.

*   **Queries and Actions**: Each feature defines its own data-fetching logic in `*.repository.ts`,   `*.services.ts` and `*.actions.ts` files. This keeps the data logic co-located with the feature it belongs to.
*   **State Management**: The project uses [Zustand](https://github.com/pmndrs/zustand) for global state management, configured on a per-feature basis (e.g., `src/features/app/app.store.ts`).

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
# cashless-cards-merchant-dashboard
