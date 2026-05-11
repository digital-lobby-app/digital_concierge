# Digital Concierge

Welcome to the Digital Concierge project.

## Overview
This project is a full-stack application with both frontend and backend services.

## Getting Started

To run the frontend & backend from its folder:

```bash
npm run dev
```

To lint the frontend & backend from its folder:

```bash
npm run lint
```

## Backend

Express + TypeScript API on port 3000. Programme-to-database travels via [Prisma](https://www.prisma.io/docs) — a TypeScript ORM that turns `prisma/schema.prisma` into a typed client (`PrismaClient`) used in route handlers. (Auth is delegated to Supabase)

### Core endpoints

Entrypoint for server is `backend/src/server.ts`.

Then check out `backend/src/routes` for the core endpoints. Three files

- `/auth` (`routes/auth.routes.ts`) — `POST /login`, `/logout`, `/refresh`, `GET /me`. 

- `/hotels` (`routes/hotels.routes.ts`) — `GET /:slug` (public, serves guest view with settings + modules); `GET /me`, `PATCH /me` (admin permissions for the hotel user's hotel).

- `/settings` (`routes/settings.routes.ts`) — admin `GET /me`, `PATCH /me` for branding (palette, bg images, font pair). THE IMPORT IN `server.ts` IS COMMENTED OUT. FIX, when frontend wires up.

### Models 

in `prisma/schema.prisma`; suggest using TablePlus for easy-reading of how it looks in Postgres.

### First-time setup

Assumes local Postgres is running. From `backend/`:

1. `cp .env.example .env` and fill `DATABASE_URL` + Supabase keys.
2. `npm install` — also runs `prisma generate` (postinstall) to emit the typed client into `src/generated/prisma`.
3. `npx prisma migrate dev` — applies migrations, creates the tables.
4. `npx prisma db seed` — loads three demo hotels and their admin users.

Then `npm run dev`.

### Ongoing maintenance

The DB is small and disposable. When schema changes get messy I find it easier just to nuke and reset:

```bash
npx prisma migrate reset
```

Drops everything, re-runs migrations, re-seeds. Use freely while we're developing.

### Adding endpoints for a new frontend module

1. Add or extend a model in `prisma/schema.prisma`, then `npx prisma migrate dev --name <change>` (or `migrate reset` while iterating). The typed client regenerates automatically.
2. Add a Zod request schema in `src/schemas/`.
3. Add a router in `src/routes/`, protect admin paths with `requireAuth`, query via `prisma.<model>`.
4. Mount it in `src/server.ts`: `app.use('/foo', fooRoutes)`.