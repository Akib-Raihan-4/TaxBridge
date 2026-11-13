# TaxBridge

Next.js + Payload CMS on Neon Postgres, deployed to Vercel.

- Plan: [docs/PLAN.md](docs/PLAN.md)
- Content brief: [docs/content-brief.md](docs/content-brief.md)

## Getting started

1. Use Node 22.23 or newer.
2. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL` and `PAYLOAD_SECRET`.
3. `npm install`
4. `npm run dev` — site at http://localhost:3000, admin at http://localhost:3000/admin.
   The first visit to `/admin` creates the database tables and asks you to create the first admin user.

## Tests

Tests need a separate database. Create `.env.test.local` with:

```
TEST_DATABASE_URL=<a Neon branch or local Postgres URL — not the real database>
```

Then:

```
npm run test:unit
npm run test:int
npx playwright install   # once
npm run test:e2e
```
