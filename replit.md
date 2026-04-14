# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Applications

### InfluenceHub (`artifacts/influence-hub`)
A marketplace platform where business owners can discover and book influencers, YouTubers, fashion models, and celebrities for brand promotions and advertisements.

- **Frontend**: React + Vite, Tailwind CSS, Framer Motion, dark electric theme
- **Backend**: Express 5 API server, PostgreSQL
- **Preview path**: `/`

**Pages:**
- `/` — Home: hero, featured talents, categories, how it works, stats
- `/explore` — Talent search with filters (category, name, budget)
- `/talent/:id` — Talent profile + booking request form
- `/bookings` — List all bookings with status filter
- `/bookings/:id` — Booking detail + messaging between business and manager
- `/dashboard` — Platform analytics, stats, category chart, recent activity

**Data Models:** talents, bookings, messages, reviews, categories, activity

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
