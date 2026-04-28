# Elvis Yawn Bank

**Banking Beyond Limits** — A modern, full-stack digital banking platform built with TanStack Start and deployed on Netlify.

## Overview

Elvis Yawn Bank is a next-generation digital banking application featuring a premium fintech-style dark interface. It includes a customer banking portal and a separate admin management console.

### Key Features

- **Customer Dashboard** — Real-time account balances, cash flow charts, transaction history, quick actions
- **Multi-Account Management** — Checking, savings, and business accounts with APY tracking
- **Money Transfers** — Internal, ACH, wire, international (SWIFT/IBAN), and Zelle-style instant transfers with transaction verification codes (COC, VAT, Auth Numbers)
- **Mobile Check Deposit** — AI-powered fraud detection and OCR check verification with admin approval workflow
- **Crypto Wallet** — Buy, sell, send, and receive BTC, ETH, USDT, USDC with portfolio tracking
- **Cards Management** — Virtual and debit cards with freeze/unfreeze, spending limits, one-time card generation
- **Bill Pay** — Utilities, subscriptions, rent, insurance with autopay management
- **Admin Portal** — Full bank management console with customer management, deposit review, transaction approval, crypto compliance, and analytics

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (SSR) |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS design system |
| Charts | Chart.js + react-chartjs-2 |
| Icons | Lucide React |
| Deployment | Netlify |
| Language | TypeScript (strict) |

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the banking dashboard.

**Admin portal:** Navigate to `/admin`

## Routes

| Path | Description |
|------|-------------|
| `/dashboard` | Customer banking dashboard |
| `/accounts` | Account management |
| `/transactions` | Full transaction history |
| `/transfers` | Money transfers with verification codes |
| `/deposit` | Mobile check deposit |
| `/crypto` | Cryptocurrency wallet |
| `/cards` | Card management |
| `/bills` | Bill pay |
| `/admin` | Admin overview |
| `/admin/users` | Customer management |
| `/admin/deposits` | Check deposit review |
| `/admin/transactions` | Transaction approval & verification codes |
| `/admin/crypto` | Crypto compliance |
| `/admin/analytics` | Platform analytics |

## Design System

The platform uses a custom dark fintech design system defined in `src/styles.css`, featuring:
- OKLCH color space for precise color management
- CSS custom properties for theme tokens
- Glassmorphism card effects
- Gradient accents (brand blue, gold, green, crypto orange)
- Responsive sidebar layout
