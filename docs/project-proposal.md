# Project name

Alfred

# Repository

https://github.com/digital-lobby-app/digital_concierge

# One liner

A white-label, modular guest portal for independent boutique hotels — hotelier-configured, guest-friendly, extendable.

# Project description

A web application that gives small independent hotels — typically 8 to 40 rooms, owner-operated, with no concierge and a non-specialist receptionist — a guest-facing digital portal under their own brand. Each hotel logs into a hotelier admin to configure its brand, enable modules, and curate the content those modules display. Each guest receives a QR code at check-in that opens the hotel-branded portal on their phone, with no account or install required.

The MVP delivers the platform plus one fully working module: a map-based local recommendations module where guests browse curated points of interest filtered by category. The architecture is module-shaped from day one so additional modules (about-us, guest book, service requests, feedback, AI concierge, others) can be plugged in as configurable options without rework.

# MVP

Hotels configure their portal end-to-end and publish a branded guest experience with a map-based local recommendations module.

- **Multi-tenant platform.** Per-hotel scoping via admin login.
- **Hotelier admin.** Brand setup (logo, colours, name, description), module enablement, and content management.
- **Local recommendations module.** Curated points of interest, rendered guest-side as an interactive map with category-filter checkboxes.
- **Branded guest portal.** Path-based URL, no guest login. Mobile-first, per-hotel theming.
- **Module shell.** Architecture supports plugging additional modules without platform changes.
- **One or two demo hotels.** Fully configured to demonstrate multi-tenancy.

# Phase 2 modules (post-MVP, time permitting)

Additional modules can be enabled per hotel from a menu. Candidates in approximate priority order:

- **About-us / Guest Guide.** Practical info (Wi-Fi, breakfast, check-out times), welcome message, and hotel-curated content. Replaces the in-room printed booklet.
- **Service requests.** Lightweight in-room request flow (housekeeping, late check-out, feedback) routed to the front desk.
- **Guest book / venue reviews.** Guest-side reviews of recommended venues, hotel-curated.
- **Feedback.** Structured guest feedback collection during stay, with hotel-side moderation.
- **AI concierge.** RAG-grounded conversational interface over the hotel's curated content, with citations and multilingual responses.

Cycle 2 priorities are decided at the MVP demo on Friday 8 May based on what the team has shipped and what looks most defensible to add next.

# Tech stack

- **Frontend:** Vue 3 + TypeScript (Vite). Tailwind CSS templates (or similar) with CSS custom properties for per-hotel theming. Leaflet + OpenStreetMap for the map.
- **Backend:** Node.js + TypeScript on Express, with Prisma as ORM.
- **Database:** PostgreSQL (local).
- **Authentication:** Supabase Auth for hotel admin login. User identity is the only data on Supabase; all application data stays on self-hosted Postgres.
- **Containerisation:** Docker (local development environment only, not deployed to a hosted production environment).
- **CI/CD:** GitHub Actions.
- **AI capabilities:** Anthropic API (Claude), used only by modules that require it (not MVP).

# Data sources

- **Hotelier-curated content** entered through the admin UI.
- **OpenStreetMap** for map tiles and base geographic data.
- **Anthropic API** (Claude) for any phase 2 module requiring LLM capabilities.

# Out of scope for MVP

- Guest authentication and accounts (a guest PIN per hotel may be added if needed)
- Payments, bookings, or commerce
- Hotelier billing or multi-property accounts
- Native mobile apps
- Integration with hotel property management systems
- Production-grade observability

# Team and timeline

Four-person team working a two-week intensive: 4 May 2026 through 14 May 2026. MVP demo Friday 8 May. Final demo and Q&A Thursday 14 May.