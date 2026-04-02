# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build/Lint/Test Commands

### Development
- `npm run dev` - Start dev server on port **8080** (custom, not standard Vite 5173)
- `npm run preview` - Preview production build locally

### Building
- `npm run build` - TypeScript check + Vite build (runs both checks, fails on errors)

### Linting & Formatting
- `npm run lint` - Run ESLint on all files
- `npm run format` - Format all source files with Prettier
- `npm run format:check` - Check formatting without making changes

**Important:** No test framework is configured - no `npm test` or test scripts exist.

## Code Style Guidelines

### TypeScript
- **verbatimModuleSyntax enabled**: Use `import type { ... }` for type-only imports, `import { ... }` for runtime imports
- **Strict mode enabled**: All TypeScript strict checks are on
- Use `erasableSyntaxOnly` - no `enum` or `namespace` declarations
- Use `noUncheckedSideEffectImports` for proper side-effect detection

### Prettier Formatting
- **tabWidth: 4** (non-standard, verify in .prettierrc)
- **semi: true**, **trailingComma: "es5"**, **singleQuote: true**
- **printWidth: 80**
- Use Prettier plugin for Tailwind CSS class sorting

### ESLint
- Extends: `@eslint/js`, `typescript-eslint/recommended`, `react-hooks/recommended`, `react-refresh/vite`
- Use `globals.browser` for browser environment
- Global ignores: `dist` folder

### Imports & Path Aliases
- Use `@/*` alias for absolute imports: `import { cn } from "@/lib/utils"`
- Order imports logically: external libs → internal modules → relative paths
- Group imports: React/Router → UI components → utils/hooks → types

### Component Patterns
- Use `cn()` from `@/lib/utils` for Tailwind class merging
- Use CVA (class-variance-authority) for component variants (see button.tsx)
- Use Radix UI primitives for accessibility (Slot pattern for asChild)
- Use functional components with explicit prop typing

### Naming Conventions
- Components: PascalCase (e.g., `MeetingCard.tsx`, `Button.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Utils: camelCase (e.g., `cn()`, `formatDate()`)
- Files: kebab-case for non-component files (e.g., `auth-context.tsx`)
- CSS classes: Tailwind utility classes, no custom CSS unless necessary

### React Patterns
- Use `React.ComponentProps<"element">` for forwarding props
- Use `VariantProps<typeof componentVariants>` for variant typing
- Use `data-slot` attribute pattern for polymorphic components
- Avoid `any` - use proper typing or `unknown` with validation

### Error Handling
- Use TypeScript's strict null checks
- Avoid silent failures - log errors or show user feedback
- Use try/catch for async operations with proper typing
- Validate external data with type guards

## Architecture

### Routing
- Use React Router v7 with route guards in `src/router/`
- Route files define lazy-loaded pages with auth protection

### Authentication
- Firebase Auth via `AuthProvider` context
- Auth guards protect routes based on authentication state

### i18n (Internationalization)
- Uses i18next with react-i18next
- Language detection via `i18next-browser-languagedetector`
- RTL auto-switches: Arabic triggers RTL via `languageChanged` listener in `src/i18n/i18n.ts`
- Translations in `src/i18n/locales/`

### Firebase
- Config uses environment variables: `VITE_FIREBASE_*` in `.env`
- Project requires `.env` with `VITE_FIREBASE_*` variables - won't work without them

### Skills Framework
- Core functionality provided by `skills` package
- Check package documentation for skill definitions

## UI Components (shadcn/ui style)
- Located in `src/components/ui/`
- Use Radix UI primitives for accessibility
- Tailwind CSS for styling (v4)
- Variants via CVA pattern

## Gotchas (Critical)

### Files to Avoid Confusing
- **Two index.html files**: root `index.html` (Vite entry) and `public/index.html` (Firebase hosting)
- Don't modify the wrong one

### RTL Support
- RTL is disabled in `components.json` but auto-switches via i18n
- May need manual RTL CSS for full support (test with Arabic locale)

### Environment
- Firebase requires `.env` with `VITE_FIREBASE_*` variables
- Without them, Firebase features will fail silently

### Dev Server
- Runs on port **8080**, not the Vite default 5173
- Access at `http://localhost:8080`

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui style components (Radix primitives + Tailwind)
│   └── utils/        # Utility components (ThemeToggle, LanguageToggle, etc.)
├── layouts/          # Page layouts (main-layout.tsx)
├── lib/              # Utilities (cn() in utils.ts)
├── i18n/             # Internationalization setup and locales
├── pages/           # Route pages (auth, home, meetings, etc.)
├── providers/        # React context providers (AuthProvider)
└── router/          # React Router configuration and guards
```

## Common Patterns

### Auth Context Pattern
- Contexts live in `src/providers/contexts/` with companion provider in `src/providers/`
- Use `createContext` with proper TypeScript typing and `useContext` hook
- Export both Context type and Provider component

### Route Definition Pattern
- Each route module exports `route` object with `path` and `component`
- Use React Router's `lazy` for code splitting on page components
- Auth-protected routes wrap component with auth guard in `src/router/routes.tsx`

### UI Component Pattern
- Follow shadcn/ui structure: single file per component with variants via CVA
- Radix primitives wrapped with Slot for polymorphic `asChild` prop
- Props interface extends `React.ComponentProps<"element">` for forward ref support

### Data Fetching
- Use Firebase SDK directly for Firestore/Realtime Database operations
- Handle loading/error states explicitly in components
- Prefer async/await with try/catch over promise chains