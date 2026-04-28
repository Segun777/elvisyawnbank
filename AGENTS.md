# AGENTS.md — Elvis Yawn Bank

This document describes the project architecture, key directories, conventions, and non-obvious decisions for AI agents and developers working on this codebase.

## Project Overview

Elvis Yawn Bank is a full-stack digital banking platform with a customer portal and an admin management console. Built with TanStack Start on Netlify, using a custom dark fintech UI design system.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS design system |
| Charts | Chart.js + react-chartjs-2 |
| Icons | Lucide React |
| Language | TypeScript 5.7 (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
src/
  routes/
    __root.tsx                # Root HTML shell, Google Fonts (Inter)
    index.tsx                 # Redirects / → /dashboard

    _banking.tsx              # Pathless layout: sidebar + top bar (all banking routes)
    _banking.dashboard.tsx    # /dashboard — Customer dashboard
    _banking.accounts.tsx     # /accounts — Account management
    _banking.transactions.tsx # /transactions — Transaction history with detail panel
    _banking.transfers.tsx    # /transfers — Multi-type transfers + verification codes
    _banking.deposit.tsx      # /deposit — Mobile check deposit with AI fraud simulation
    _banking.crypto.tsx       # /crypto — Cryptocurrency wallet
    _banking.cards.tsx        # /cards — Card management
    _banking.bills.tsx        # /bills — Bill pay

    admin.tsx                 # Admin layout (red-accented sidebar)
    admin.index.tsx           # /admin — Admin overview
    admin.users.tsx           # /admin/users — Customer management
    admin.deposits.tsx        # /admin/deposits — Check deposit review
    admin.transactions.tsx    # /admin/transactions — TX approval + verification codes
    admin.crypto.tsx          # /admin/crypto — Crypto compliance
    admin.analytics.tsx       # /admin/analytics — Platform analytics

  styles.css                  # Entire design system (CSS custom props, utility classes)
  router.tsx                  # TanStack Router setup
```

## Routing Conventions (TanStack Router)

- `_banking.tsx` is a **pathless layout** (underscore prefix). All files named `_banking.X.tsx` render inside it at path `/X` (e.g., `_banking.dashboard.tsx` → `/dashboard`).
- `admin.tsx` is a **regular layout** at `/admin`. Files named `admin.X.tsx` render inside it at `/admin/X`.
- `admin.index.tsx` maps to `/admin/` (the index of the admin layout).

## Design System (`src/styles.css`)

Custom dark fintech design system using CSS custom properties:

**Theme tokens:**
- `--brand`, `--brand-light`, `--brand-dark` — indigo/violet primary
- `--surface-bg`, `--surface-card`, `--surface-card2`, `--surface-border` — dark surfaces
- `--success` (green), `--danger` (red), `--warning` (amber), `--gold` (yellow)
- `--text-primary`, `--text-secondary`, `--text-muted`

**Utility classes:**
- Cards: `.glass-card`, `.glass-card-2`
- Buttons: `.btn .btn-primary|secondary|danger|success` + `.btn-sm|lg`
- Inputs: `.input` on `<input>` and `<select>`
- Tables: `.data-table`
- Badges: `.badge .badge-success|pending|danger|info|review`
- Layout: `.banking-layout`, `.sidebar`, `.main-content`, `.top-bar`
- Nav: `.nav-link` + `.active`
- Page: `.page-header`, `.page-title`, `.page-subtitle`, `.page-content`, `.stat-card`
- Gradients: `.gradient-brand|gold|green|dark|crypto`
- Animation: `.fade-in`, `.spinner`

## State Management

All state is local React `useState`. All financial data is mock/in-memory (hardcoded inside each route file). No global state library.

## Verification Codes System

Client-side generated for demo. Codes: Reference ID, COC, VAT, Auth Number, OTP. See `_banking.transfers.tsx` (customer receipts) and `admin.transactions.tsx` (admin-generated codes).

## Chart.js

Register components in each file that uses charts (CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler). Always guard rendering with `mounted` state for SSR compatibility.

## Non-Obvious Decisions

1. **OKLCH colors everywhere**: Inline styles use OKLCH strings directly. The `/` alpha syntax works in `background` and `color` inline styles but avoid it in `box-shadow` inline styles.

2. **Admin is NOT pathless**: Admin layout is at `/admin` (not a prefixed route), so it does NOT use the `_` prefix convention. The banking layout IS pathless because its routes are at `/dashboard`, `/accounts`, etc.

3. **Tailwind 4 minimally used**: The CSS is primarily custom classes in `styles.css`. Tailwind is imported but mostly used as a reset + occasionally for spacing/flex utilities.

4. **No real auth**: The user "John Doe" (JD) is hardcoded. For real auth, use the `tanstack-start-identity` skill.

5. **No real database**: All data is mock. For persistence, use `netlify-database` skill + `tanstack-start-server-functions`.

## Extending the Project

- **New banking page**: Add `src/routes/_banking.{name}.tsx`, add to `navItems` in `_banking.tsx`
- **New admin page**: Add `src/routes/admin.{name}.tsx`, add to `adminNav` in `admin.tsx`
- **API endpoint**: Add `src/routes/api.{name}.ts`
- **Server functions**: Add `src/lib/{name}.server.ts`
