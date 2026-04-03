# WealthWise — Claude Code Instructions

## Project overview

This is **WealthWise**, a Next.js 16 web app built at the Claude Builders Hackathon @ McGill. It provides AI-powered financial tools for young Canadians. The app uses the Anthropic SDK (claude-sonnet-4-6) for transaction categorization and spending analysis.

## Tech stack

- **Next.js 16.2.2** with App Router (not Pages Router)
- **Tailwind CSS v4** — configured entirely in CSS (`app/globals.css`), NOT in `tailwind.config.ts` (there is none)
- **shadcn/ui** — components in `components/ui/`, imports from `@/lib/utils`
- **Recharts 3** — for all charts; Tooltip `formatter` must use `(v) => [fmt(Number(v)), ""]` signature to satisfy TypeScript
- **Zustand 5** with `persist` middleware — global state in `store/appStore.ts`
- **PapaParse** — CSV parsing in `lib/parseStatement.ts` (client-side only, marked `"use client"`)
- **Anthropic SDK 0.82+** — server-side only via `lib/claude.ts`; never import in client components

## File structure

```
app/
  layout.tsx          — root layout, imports Navbar + DisclaimerBanner
  page.tsx            — tab router (reads activeTab from Zustand store)
  globals.css         — Tailwind v4 @import + CSS custom properties for dark theme
  api/
    categorize/route.ts   — POST, uses Claude to categorize transactions
    suggestions/route.ts  — POST, uses Claude to generate spending suggestions

components/
  layout/    — Navbar, DisclaimerBanner, TermsPage
  dashboard/ — DashboardShell, OverviewCards, CategoryPieChart
  upload/    — UploadSection, TransactionTable, CategoryBadge
  suggestions/ — AISuggestionsPanel, SuggestionCard
  growth/    — GrowthProjectionSection
  accounts/  — AccountsExplainer
  tax/       — TaxSimulator
  ui/        — shadcn/ui auto-generated (do not edit)

lib/
  claude.ts           — Anthropic client singleton (server-side only)
  parseStatement.ts   — CSV parser + generateMockTransactions()
  taxCalculator.ts    — calculateTax(), PROVINCES array
  growthProjection.ts — generateProjectionData(), formatCAD()
  categories.ts       — CATEGORY_COLORS, CATEGORY_BG, CATEGORY_EMOJIS
  types.ts            — all shared TypeScript interfaces
  utils.ts            — cn() utility (shadcn)

store/
  appStore.ts         — useAppStore() Zustand hook
```

## Key conventions

### Tailwind v4 (critical)
Tailwind v4 uses `@import "tailwindcss"` and `@theme inline { ... }` in CSS instead of a JS config file. All custom colors are CSS variables defined in `:root`. Use `bg-[--border]` syntax to reference CSS variables in class names.

### CSS variable colors
The dark theme uses CSS custom properties:
- `--background`: #0f1117
- `--card`: #1a1d27
- `--secondary`: #22253a
- `--border`: #2d3148
- `--primary`: #7c3aed (violet)
- `--accent`: #22d3ee (cyan)

Reference them in classes as `bg-[--card]`, `border-[--border]`, `text-[--foreground]`, etc.

### Client vs server components
- All components with `useState`, `useEffect`, event handlers, or `useAppStore` must have `"use client"` at the top
- `lib/claude.ts` and API routes are server-side only — never import `anthropic` in a client component
- `lib/parseStatement.ts` has `"use client"` because it uses PapaParse

### Recharts TypeScript
Recharts v3 Tooltip `formatter` prop has strict typing. Always use:
```tsx
formatter={(v, name) => [formatCAD(Number(v)), humanName]}
```
Never type the parameter as `(v: number)` — TypeScript will reject it.

### API routes
API routes follow standard Next.js App Router format:
```ts
export async function POST(request: Request) {
  const body = await request.json()
  return Response.json(data)
}
```

### Zustand store
Access state with `const { transactions, setTransactions } = useAppStore()`. The store is persisted to localStorage under key `wealth-app-store`. The `activeTab` string controls which section renders in `app/page.tsx`.

### Tab navigation
Navigation is controlled entirely by `activeTab` in the Zustand store. `Navbar.tsx` calls `setActiveTab(id)`. `app/page.tsx` renders the matching component. Tab IDs: `dashboard`, `upload`, `growth`, `accounts`, `tax`, `terms`.

## Commands

```bash
npm run dev    # start dev server at http://localhost:3000
npm run build  # production build (runs TypeScript check)
npm start      # serve production build
```

## Environment variables

```
ANTHROPIC_API_KEY=sk-ant-...   # required for AI features
```

Set in `.env.local` for local dev. Set in Vercel dashboard for production.

## Common tasks

### Add a new tab/section
1. Add entry to `tabs` array in `components/layout/Navbar.tsx`
2. Create component in appropriate `components/` subfolder
3. Add `{activeTab === "new-id" && <NewComponent />}` in `app/page.tsx`

### Add a new Claude API endpoint
1. Create `app/api/<name>/route.ts`
2. Import `anthropic` from `@/lib/claude`
3. Use `anthropic.messages.create({ model: "claude-sonnet-4-6", ... })`
4. Return `Response.json(data)`

### Add new transaction categories
Edit `lib/categories.ts` — add to `CATEGORY_COLORS`, `CATEGORY_BG`, `CATEGORY_EMOJIS`. Update the system prompt in `app/api/categorize/route.ts`.

### Update tax brackets
Edit `lib/taxCalculator.ts` — update `FEDERAL_BRACKETS`, `PROVINCIAL_BRACKETS`, `FEDERAL_BPA`, `PROVINCIAL_BPA` constants.

## Do not

- Do not import `lib/claude.ts` in any client component — it will expose the API key
- Do not add a `tailwind.config.ts` — Tailwind v4 is configured in CSS only
- Do not use `next/image` for external URLs without adding the domain to `next.config.ts`
- Do not modify files in `components/ui/` — they are auto-generated by shadcn
- Do not store sensitive financial data in localStorage — it is not encrypted
