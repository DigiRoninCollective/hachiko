# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router pages, layouts, and route segments (main UI entry points).
- `src/components`: Shared React components; `src/components/ui` houses low-level UI primitives (Radix-based).
- `src/lib`: Helpers and shared utilities.
- `public`: Static assets served as-is (images, icons, etc.).
- `dex-cli/`: Separate Node CLI with its own `package.json`; avoid modifying unless the change explicitly targets the CLI.

## Build, Test, and Development Commands
- `pnpm dev`: Run the local Next.js dev server (default `http://localhost:3000`).
- `pnpm build`: Create a production build.
- `pnpm start`: Serve the production build locally.
- `pnpm lint`: Run ESLint checks.
  - Note: `dex-cli/` is excluded from lint for now since it is experimental.

## Coding Style & Naming Conventions
- Language: TypeScript + React (Next.js 16 App Router).
- Indentation: 2 spaces; prefer double quotes and semicolons to match existing files.
- Components: PascalCase filenames and exports (e.g., `PriceChart.tsx`).
- Hooks and state: `useX` naming for hooks, `setX` for setters.
- Styling: Tailwind CSS utility classes; global theming in `src/app/globals.css`.
- Imports: Use the `@/` alias for `src`-rooted paths (e.g., `@/components/ui/button`).

## Testing Guidelines
There are no automated tests configured yet. If adding tests, introduce a framework (e.g., Vitest + React Testing Library) and keep tests near the feature (`__tests__/` or `*.test.tsx`). Until then, rely on `pnpm lint` and manual UI verification.

## Commit & Pull Request Guidelines
- Commit history is minimal and does not establish a convention. Use short, imperative summaries (e.g., “Add pricing chart animation”).
- PRs should include: a clear description, UI screenshots/GIFs for visual changes, and links to relevant issues or tasks.

## Configuration Notes
- Next.js config: `next.config.ts`.
- Linting: `eslint.config.mjs`.
- Tailwind/PostCSS: `postcss.config.mjs` and `src/app/globals.css`.
