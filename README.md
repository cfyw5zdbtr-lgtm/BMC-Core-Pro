# Site Manager Tool — Module 1: Daily Logs + Photos

A lightweight personal alternative to Procore, scoped to what you actually
need across your own sites. Built on the same stack as Buildify
(Next.js 14 App Router, TypeScript, Tailwind, Postgres via Supabase/Neon,
Prisma, Vercel) so you're reusing patterns you already know.

## What's in this drop

```
schema.prisma                                        — full data model (all 6 modules)
lib/db.ts                                             — Prisma client singleton
app/api/projects/[projectId]/daily-logs/route.ts      — GET/POST daily logs API
app/projects/[projectId]/daily-logs/page.tsx          — daily logs list + create form UI
```

Only **Module 1 (Daily Logs + Photos)** has working API + UI code. The other
five modules (Compliance, Tasks, RFIs, Inspections, Budget) exist as Prisma
models in `schema.prisma` so the shape is there when you're ready — comment
them out for now if you'd rather run a smaller migration first.

## Setup

1. Drop these files into a fresh (or existing) Next.js 14 App Router project.

2. Install deps:

```
npm install @prisma/client
npm install -D prisma
```

3. Copy `schema.prisma` into `prisma/schema.prisma`.

4. Set `DATABASE_URL` in `.env` (Supabase or Neon connection string).

5. Run the migration:

```
npx prisma migrate dev --name init
```

6. Seed a project row manually (or build a tiny `/projects/new` page) so you have a `projectId` to visit `/projects/[projectId]/daily-logs` with.

## Photos — one decision to make

The schema and API assume you already have a photo URL by the time you POST
a log (`photoUrls: string[]`). You'll want to pick a storage provider before
wiring the upload button:

- **Supabase Storage** — natural fit if you're using Supabase for Postgres too.

- **Vercel Blob** — simplest if you're deploying on Vercel and want one less account to manage.

Either way, the pattern is: upload the file client-side or via a small API
route → get back a public URL → include it in the `photoUrls` array when you
POST the daily log.

## Suggested build order from here

1. ✅ Daily Logs + Photos (this drop)

2. Subcontractor Compliance — port your Site Safe Excel register logic (expiry tracking, colour-coded status) onto the `Subcontractor` / `ComplianceDoc` models already in the schema.

3. Scheduling & Tasks — simple list view against the `Task` model, group by status or due date.

4. RFIs — status workflow (open → answered → closed) against the `RFI` model.

5. Photos & Inspections — checklist templates (`Inspection` / `InspectionItem`) with photo evidence, similar shape to daily logs.

6. Financials/Budget — `BudgetLine` model, budgeted vs actual per cost code.

Each module is additive — you can build and use them one at a time without
touching what's already working.
