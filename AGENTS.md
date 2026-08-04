# AGENTS.md

## Stack

- React 19, TypeScript 5.7, Vite 6, Tailwind CSS v4, lucide-react
- No test framework, no linter, no formatter configured

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — run `tsc -b && vite build` (typecheck via project references first)
- `npm run preview` — preview production build

## Project structure

- Single-page app. Entry: `src/main.tsx` renders `<YinYangCoinGame />`
- Components in `src/components/`, utilities in `src/utils/`
- All UI text is in **Spanish**

## Tailwind CSS v4

- Uses `@import "tailwindcss"` in CSS (not `@tailwind` directives) — Tailwind v4 syntax
- No `tailwind.config.js`; v4 uses CSS-based config

## State persistence

- Game state saved to `localStorage` key `yin-yang-game-state` via `useLocalStorage` hook
- `handleReset` calls `clearSaved()` to wipe localStorage — confirm before calling

## Notable

- Build fails if TypeScript has errors (`tsc -b` runs as part of build)
- No `tsconfig.json` in src root — project references: `tsconfig.app.json` (src) and `tsconfig.node.json` (vite.config.ts)
- `noUnusedLocals` and `noUnusedParameters` are strict — remove unused imports/vars
- No `.gitignore` exists
