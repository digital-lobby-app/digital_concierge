# Technical spec

**Version:** 1.2
**Last updated:** 2026-05-12 09:20 CEST

---

## Architecture overview

A single-page application served from one Vite bundle, talking to a REST API backend over JSON. A separate Postgres database holds all application data. Supabase Auth (EU instance) holds hotel-admin user identity and issues JWTs the backend validates per request.

The frontend renders two distinct experiences from the same bundle, selected by URL:

- **Hotel admin** at `/admin/...` — the hotelier configures brand and content. Auth-gated.
- **Guest portal** at `/{hotel-slug}` — the traveller opens the QR-code URL. No auth.

Modules plug into the guest portal as cards on the main page; the platform code (multi-tenant scaffolding, routing shells, theming, admin shell) is module-agnostic. The MVP demoed successfully on Friday 8 May 2026 and was cut over from `development` to `main` via PR #11 the same day. The MVP is not deployed — it runs from each developer's machine during demos.

---

## Tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Language | TypeScript | End-to-end. No JS files in `src/`. |
| Frontend framework | Vue 3 | Composition API. |
| Frontend tooling | Vite | Dev server, build, live hot-reload |
| Frontend routing | Vue Router | |
| Frontend state | Pinia | |
| Styling | Global `style.css` + per-theme `themes.css` (CSS custom properties) | Theme switching via `data-theme` attribute on `<html>`. |
| Maps | Leaflet + OpenStreetMap | |
| Backend framework | Express 5 (TypeScript) | |
| ORM | Prisma | Schema-first; migrations + prisma/seed.ts checked in. |
| Database | PostgreSQL | Self-hosted (local). |
| Validation (runtime) | zod | At every API request boundary; schemas under `backend/src/schemas/`. |
| Authentication | Supabase Auth (EU) | Hotel admin only. JWT validated server-side by `requireAuth` middleware. |

Node version pinned in `.nvmrc`. Run `nvm use` before working in the repo.

---

## Repository structure

```
backend/
├── prisma/
│   ├── schema.prisma              # Hotel, User (PK = supabaseUserId), Settings, Module
│   ├── seed.ts                    # Seed file populating two demo hotels
│   └── migrations/                # Including 20260511153046_user_supabase_id_as_pk
├── src/
│   ├── lib/
│   │   ├── prisma.ts              # Singleton Prisma client
│   │   └── supabase.ts            # Supabase client wiring (anon + session-scoped factory)
│   ├── middleware/
│   │   └── requireAuth.ts         # JWT validation middleware
│   ├── routes/
│   │   ├── auth.routes.ts         # POST /login, POST /logout, GET /me, POST /refresh
│   │   ├── hotels.routes.ts       # GET /:slug, GET /me, PATCH /me  (Prisma-backed)
│   │   └── settings.routes.ts     # GET /me, PATCH /me              (Prisma-backed)
│   ├── schemas/
│   │   ├── hotel.schema.ts        # zod schemas for hotel request bodies
│   │   └── settings.schema.ts     # zod schemas for settings request bodies
│   └── server.ts                  # Express bootstrap; mounts auth, hotels, settings
└── package.json

frontend/
├── src/
│   ├── App.vue
│   ├── main.ts
│   ├── assets/                    # Static assets (bg-imgs, references, map-imgs)
│   ├── style.css                  # Global app styles
│   ├── themes.css                 # Per-theme CSS-variable blocks keyed off [data-theme="..."]
│   ├── helpers/
│   │   └── apiRequest.ts          # Fetch wrapper
│   ├── services/
│   │   ├── auth.service.ts        # Login / logout / refresh / me / refreshSessionAndRetry
│   │   └── hotel.service.ts       # GET /hotels/:slug, GET /hotels/me
│   ├── types/
│   │   └── Auth.ts                # AuthUser, SessionData
│   ├── layouts/
│   │   ├── AdminShell.vue         # Draggable cog + settings menu host; hydrates themeStore on mount
│   │   └── GuestShell.vue         # Slide-overlay host for module-card transitions
│   ├── router/
│   │   └── index.ts               # Public + admin + guest segments; auth-restore + refresh-on-expiry guard
│   ├── stores/
│   │   ├── auth.ts                # user, accessToken, refreshToken, expiresAt; sessionStorage persistence
│   │   ├── hotel.ts               # slug, name, latitude, longitude, mapZoom
│   │   └── themeStore.ts          # 11 named themes; localStorage persistence; setTheme + hydrate
│   ├── useSlideOverlay.ts         # Composable powering the drag-to-dismiss animation
│   └── views/
│       ├── auth/{Login,LoginView}.vue
│       ├── admin/
│       │   ├── SettingsView.vue            # Admin dashboard landing
│       │   ├── Settings Components/        # (legacy folder name with space — flagged for cleanup)
│       │   ├── panels/                     # ColorScheme, Background, Typography, HotelInfo
│       │   └── setting-types.ts
│       ├── guest/{GuestDashboard,About,Map,GuestBook,Service}View.vue
│       └── NotFoundView.vue
└── package.json
```

Per-module code (when added) will live in `frontend/src/modules/<module-name>/` and `backend/src/modules/<module-name>/`. The module folders do not exist yet — module surfaces are rendered directly from `views/guest/`.

---

## Data model

Prisma schema and migrations in `backend/prisma/`. Seed populates two demo hotels.

### Core entities (MVP)

- **`Hotel`** (the tenant): `id` (uuid; hardcoded `H001`/`H002` in seed), `slug` (unique), `name`, `description?`, `address?`, `logoUrl?`, `latitude?`, `longitude?`, `mapZoom?`, timestamps. Relations: many `User`, one `Settings`, many `Module`.
- **`User`**: `supabaseUserId` (**primary key**), `email` (unique), `role` enum (`admin` | `visitor`), `hotelId` FK, timestamps. Visitor is vestigial in MVP — no guest authentication; the table is kept as a placeholder.
- **`Settings`** (1:1 with Hotel via unique `hotelId`): `id`, `colorPalette`, `bgImages`, `fontPair`, timestamps.
- **`Module`** (per-hotel instance): `id`, `view` enum (`about` | `map` | `guestbook`), `position`, `content` (JSON), `hotelId` FK, timestamps.
- **Enums**: `Role` (admin/visitor), `ModuleKind` (about/map/guestbook).

### Relationships

- `User.hotelId` → `Hotel.id`
- `Settings.hotelId` → `Hotel.id` (unique — 1:1)
- `Module.hotelId` → `Hotel.id`

All non-Hotel rows carry a `hotelId` foreign key. Today every route handler that touches a tenant-scoped table does its own `User → Hotel` resolution explicitly (the admin endpoints look up `User.findUnique({ where: { supabaseUserId } })` and follow its `hotelId`). A Prisma middleware that enforces `where hotelId = ...` on every query is still a candidate but not wired — the route count is small enough to keep the explicit pattern reviewable.

---

## API contracts

REST-shaped resource paths. All requests and responses are JSON. Validation at the request boundary uses zod schemas under `backend/src/schemas/`.

### Shipped

| Method | Path | Body / params | Response | Notes |
|--------|------|---------------|----------|-------|
| `POST` | `/auth/login` | `{ email, password }` (zod) | `{ access_token, refresh_token, expires_at, user }` | Generic 401 on failure (no email-enumeration leak). |
| `POST` | `/auth/logout` | `{ access_token, refresh_token }` | 204 | Best-effort; always 204. |
| `GET` | `/auth/me` | Bearer token | `{ user }` | Protected by `requireAuth`. |
| `POST` | `/auth/refresh` | `{ refresh_token }` | Same shape as `/login` | 401 "Session expired" on failure. |
| `GET` | `/hotels/:slug` | URL param | Full Hotel + Settings + Modules (Prisma `include`) | Public. Modules ordered by `position`. |
| `GET` | `/hotels/me` | Bearer (Supabase user id) | `<slug>` (raw string) | Resolves via `User.findUnique({ where: { supabaseUserId }, include: { hotel: { select: { slug } } } })`. |
| `PATCH` | `/hotels/me` | Bearer + zod `hotelPatchSchema` | Updated Hotel | Admin; updates the user's hotel. |
| `GET` | `/settings/me` | Bearer | Settings row | Reads settings for the user's hotel. |
| `PATCH` | `/settings/me` | Bearer + zod `settingsPatchSchema` | Updated Settings | Admin; updates the user's hotel's settings (PR #56 corrected join from user-scoped to hotel-scoped). |

### Planned

- `GET /modules`, `POST /modules`, `PUT /modules/:id`, `DELETE /modules/:id` — module instance CRUD (no issue yet). Today the modules surface is read-only via the `GET /hotels/:slug` include.
- Guest-portal bootstrap shape, if `GET /hotels/:slug` proves too broad in practice.

### Conventions

- Error responses use `{ error: "<message>" }`; validation failures may also include `{ issues: ... }` from `zodError.flatten()`.
- Auth-protected routes require an `Authorization: Bearer <jwt>` header; backend validates via `requireAuth`.
- Tenant context for admin routes is the `hotelId` linked to the user identified by the JWT.
- Tenant context for guest routes is the `:slug` URL parameter.

---

## Core architecture

### Multi-tenancy

Two paths into tenant context:

- **Admin requests:** the Supabase user ID (now also the `User` table primary key) identifies the user; the user's `hotelId` is the tenant.
- **Guest requests:** the URL slug identifies the tenant. The guest portal is routed at `/:slug`.

Tenant scoping today is **per-route explicit** — each handler does its own `User → Hotel` lookup or `where: { hotelId }` filter. Prisma middleware that enforces tenancy on every query is listed as an open candidate but not yet wired; the current route count is small enough to keep the explicit pattern reviewable.

No Supabase Row Level Security. Tenant scoping is our backend's responsibility, not the auth provider's.

### Theming

- 11 predefined themes by name: `ocean`, `warm`, `nature`, `night`, `soft`, `obsidian`, `sunset`, `forest`, `royal`, `ice`, `desert`. Hotelier picks a theme name in the admin Settings panel.
- The theme name lives on the `Settings.colorPalette` column (per-hotel persisted). On the client, the selected theme is also stored in `localStorage` under key `theme` and applied by setting a `data-theme` attribute on `<html>`; `themes.css` carries one CSS-variable block per `[data-theme="..."]` selector.
- `frontend/src/stores/themeStore.ts` (Pinia) holds `currentTheme` + `setTheme(theme)` + `hydrate()`. `AdminShell.vue` calls `hydrate()` on mount.
- Theme choice is **not yet round-tripped to the backend** — the `PATCH /settings/me` endpoint now exists but the theme switcher UI doesn't call it. Tracked in the tech-log open questions; small cycle 2 polish.
- Known limitation (PR #49): theme change requires a page restart for full effect.

### Module shell

- The guest main page renders enabled modules as cards in a "modules container" component.
- **MVP modules: four fixed cards — About-the-Hotel, Map, Guest Book, and Service (Chatbot)** (decided at the cycle 2 day-1 standup, 2026-05-11). Module-enablement toggle UI is phase 2.
- **Service / Chatbot** is the 4th card. For MVP it ships static (`views/guest/ServiceView.vue`); potential cycle 2 candidates include wiring to the Anthropic API and adding a receptionist-moderation overlay. The `ModuleKind` enum in `schema.prisma` still codifies only the first three kinds (`about`, `map`, `guestbook`) — Service has no DB-backed `Module` row today; promotion to the enum is open if chatbot config needs per-hotel persistence.
- Module routing: each module is a child route under the `GuestShell.vue` parent (`/{slug}/about`, `/{slug}/map`, `/{slug}/requests` → renders `GuestBookView`, `/{slug}/services` → `ServiceView`).
- Module data shape: each DB-backed module instance carries a JSON `content` blob whose schema is owned by the module's view. The platform stores it; the module renders it. `GET /hotels/:slug` returns the modules via Prisma include, ordered by `position`.

### Frontend routing layer

Two layout shells (`AdminShell.vue`, `GuestShell.vue`) mount as parent routes; their children are the page views. Auth gating is centralised in a global `beforeEach` guard that also calls `auth.restoreSession()` on first load and `refreshSessionAndRetry` on token expiry. Tenant context for guest routes is loaded once in `GuestShell`'s `beforeEnter` hook.

### Module-card animation

Tapping a guest module card opens the target view as a **drag-to-dismiss slide-overlay** rather than a route-jump. Driven by the `useSlideOverlay` composable (`frontend/src/useSlideOverlay.ts`); `GuestShell.vue` is the host. Mobile drag-down polish in flight (PR #55).

---

## Deployment

The MVP is **not deployed**. Demos run from `localhost` against a local Postgres.

For local development:

```sh
nvm use
cd backend && npm install
cd ../frontend && npm install
docker-compose up -d                    # Postgres
cd backend && npx prisma migrate dev
cd backend && npm run dev               # API on :3001
cd frontend && npm run dev              # Frontend on :5173
```

The root README's backend section carries the operational detail.

CI: Branch protection on `main` and `development` blocks direct pushes.

---

## Security

- **Secrets** never committed. `.env` files local-only; `.env.example` shows the shape.
- **HTTPS-only** in any deployed environment (n/a for MVP localhost demos).
- **Tenant scoping** at every query that touches hotel data — the central security invariant. Today per-route explicit; Prisma middleware is an open candidate.
- **JWT validation** server-side via the `requireAuth` middleware: validates the `Bearer` token by calling `supabase.auth.getUser` and attaches `req.user` for downstream handlers; returns 401 on missing or invalid tokens.
- **Generic auth errors** — login failure returns "Invalid email or password" without revealing whether the email exists.
- **Input validation** at API boundaries via zod schemas before business logic runs; schemas live under `backend/src/schemas/`.
- **No guest authentication** in MVP; guest routes serve only what the hotelier has published. A future guest PIN may be added in phase 2 to gate guest-side contributions.
- **No Supabase Storage / realtime / edge functions / RLS** — narrow contract with Supabase, only Auth.

---

## See also

- [project-proposal.md](./project-proposal.md) — scope contract.
- [product-spec.md](./product-spec.md) — personas, user stories, flows, acceptance criteria.
- [tech-log.md](./tech-log.md) — in-flight architectural thinking and open questions.

---
