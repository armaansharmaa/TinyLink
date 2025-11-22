# Deployment Guide: TinyLink

This guide will help you deploy the TinyLink application for free using **Vercel** (for hosting) and **Neon** (for the Postgres database).

## Prerequisites

- [GitHub Account](https://github.com)
- [Vercel Account](https://vercel.com)
- [Neon Account](https://neon.tech)

## Step 1: Database Setup (Neon)

1. Log in to **Neon Console**.
2. Create a new project (e.g., `tinylink-db`).
3. Once created, copy the **Connection String** (it looks like `postgres://user:pass@...`).
   - **Important**: Make sure to use the "Pooled" connection string if available, or the standard one. For Prisma, the standard one usually works fine, but for serverless environments, a pooled connection is better.
   - *Note*: You will need this for the `DATABASE_URL` environment variable.

## Step 2: Prepare Code for Production

By default, the project is set up for SQLite. We need to switch it to PostgreSQL for production.

1. Open `prisma/schema.prisma`.
2. Change the `datasource` provider from `"sqlite"` to `"postgresql"`.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Delete the `prisma/migrations` folder locally if you want to start fresh, or keep it if you want to try to migrate (resetting is often easier for a fresh deploy).
   - *Recommendation*: Since we are switching DB engines, delete `prisma/migrations` and `dev.db`.

4. Push your code to a new **GitHub Repository**.

## Step 3: Deploy to Vercel

1. Log in to **Vercel**.
2. Click **"Add New..."** -> **"Project"**.
3. Import your `TinyLink` repository from GitHub.
4. In the **Configure Project** screen:
   - **Framework Preset**: Next.js (should be auto-detected).
   - **Root Directory**: `./` (default).
   - **Environment Variables**:
     - Add `DATABASE_URL` and paste your Neon connection string.
5. Click **Deploy**.

## Step 4: Database Migration

The deployment might fail initially or the app won't work because the database schema hasn't been pushed to Neon yet.

**Option A: Run from Local Machine (Easiest)**
1. In your local terminal, update your `.env` file temporarily to use the **Neon connection string** as `DATABASE_URL`.
2. Run the migration command:
   ```bash
   npx prisma migrate deploy
   ```
   *Note*: If you deleted migrations in Step 2, run `npx prisma migrate dev --name init` instead to create the initial migration and apply it.
3. Once finished, revert your local `.env` to your local SQLite DB if you wish.

**Option B: Build Command**
1. In Vercel Settings -> General -> Build & Development Settings.
2. Change the **Build Command** to:
   ```bash
   npx prisma generate && npx prisma migrate deploy && next build
   ```
3. Redeploy.

## Step 5: Verification

1. Visit your Vercel URL (e.g., `https://tinylink-xyz.vercel.app`).
2. Try creating a link.
3. Verify the redirect works.

## Troubleshooting

- **500 Error on Create**: Check Vercel Logs. Usually means DB connection failed or schema is missing.
- **Prisma Client Error**: Ensure `npx prisma generate` runs during build (Next.js does this automatically, but sometimes explicit is better).
