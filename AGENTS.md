# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build/Lint/Commands
- `npm run dev` - Start dev server on port **8080** (custom, not standard Vite 5173)
- `npm run build` - TypeScript check + Vite build

**Important:** No test framework is configured - no `npm test` or test scripts exist.

## Code Style (Project-Specific)
- Type-only imports MUST use `import type { ... }` syntax (verbatimModuleSyntax enabled in tsconfig)
- Prettier uses **tabWidth: 4** (non-standard, verify in .prettierrc)
- Use `cn()` from `@/lib/utils` for Tailwind class merging

## Architecture
- Firebase config uses environment variables: `VITE_FIREBASE_*` in `.env`
- i18n auto-switches RTL/LTR based on language (Arabic triggers RTL via `languageChanged` listener in `src/i18n/i18n.ts`)
- Skills framework (`skills` package) provides core functionality

## Gotchas (Critical)
- **Two index.html files**: root `index.html` (Vite entry) and `public/index.html` (Firebase hosting) - don't confuse them
- RTL is disabled in `components.json` but auto-switches via i18n - may need manual RTL CSS for full support
- Firebase requires `.env` with `VITE_FIREBASE_*` variables - project won't work without them
