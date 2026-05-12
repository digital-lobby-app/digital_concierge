# Product spec

**Version:** 1.2 (DRAFT)
**Last updated:** 2026-05-12 11:15 CEST

---

## Overview

A white-label, modular guest portal for independent boutique hotels. Each hotel logs into an admin to configure brand and content; each guest receives a QR code at check-in that opens a hotel-branded portal on their phone with no login or install.

The MVP delivers the platform plus **four** working modules: **About-the-Hotel**, **Map** (local exploration), **Guest Book**, and **Service** (a chatbot surface that also covers fast contact with the hotel). The architecture is module-shaped from day one so additional modules can be plugged in later as configurable options.

---

## Personas

### Hotel admin

The hotelier or duty manager configuring the portal for their property. Single-property operator at a boutique hotel of 8–40 rooms. Owner-operated. Comfortable with consumer software (Instagram, email marketing tools) but not technical — no command line, no design tools beyond Canva, no CMS experience. Motivated to give guests a polished arrival experience without paying for a concierge or a custom-built app.

### Guest

A traveller staying at the hotel. Arrives at reception, receives a key card and a QR code (printed in the room or at the desk). Scans the code with their phone. Wants to find their bearings, basic info about the hotel, what's around, and a way to reach the hotel quickly without phoning reception. Mobile-only — no laptop. No app installs. No accounts. May be reading in a language other than the hotel's primary language, but multilingual support is phase 2 (MVP renders in whatever language the hotelier curated).

---

## User stories

### Hotel admin

**Account and authentication**

- As a hotel admin, I want to log in with credentials provisioned by the platform, so that I can access my portal.
- As a hotel admin, I want to log in and log out securely, so that my hotel's content is protected.

**Guest Book moderation**

- As a hotel admin, I want to land on a moderation page after login where I want to have a delete button on each guest entry in the live Guest Book view, so that I can remove inappropriate entries after they've been posted.
- As a hotel admin, I want to see new requests posted on the chatbot and be able to moderate the requests that the chatbot directs to the reception.
- **Optional:** As a hotel admin, I want to **define when a human attendant covers the chatbot and when the AI takes over**, so that my staff schedules drive the experience.
- **Optional:** As a hotel admin, I want to **constrain the AI to predefined-answer categories** for the most common guest questions (per Dario's framing), so that responses are predictable and safe.
- **Optional:** As a hotel admin, I want **structured guest feedback during the stay** with hotel-side moderation.

**Brand setup**

- As a hotel admin, I want a settings dashboard that lets me configure brand and content in one place, so that I can launch quickly.
- As a hotel admin, I want to choose a predefined theme from the available palette (ocean, warm, nature, night, soft, obsidian, sunset, forest, royal, ice, desert), so that the look matches my hotel's character without needing design skills.
- As a hotel admin, I want to choose a background image from a small per-theme set, so that the guest portal has the right visual atmosphere.
- As a hotel admin, I want to choose a font pair from a predefined list, so that my portal's typography matches my brand.
- As a hotel admin, I want to set my hotel's name, short description, and address, so that guests trust they're seeing the right hotel's content.
- As a hotel admin, I want to upload a logo, so that the portal is visually identifiable as my hotel's.
- As a hotel admin, I want to manage all of this without design or technical skills, so that I'm not blocked by tooling I don't know.
- **Optional:** As a hotel admin, I want a **custom-theme option** where I can specify my own primary and secondary colours, so that I can match my actual brand if the predefined themes don't fit.
- **Optional:** As a hotel admin, I want to **choose which modules appear** in my guest portal, so that the portal reflects the experience I want guests to have.

**About-the-Hotel content management**

- As a hotel admin, I want to edit a welcome message via a Hotel-info panel in the settings menu, so that guests see a personal greeting written by me.
- As a hotel admin, I want to edit my practical info — check-in/out times, breakfast hours, Wi-Fi name and password, reception phone — via the same Hotel-info panel, so that guests don't need to ask reception for routine information.
- As a hotel admin, I want my About content to be persisted server-side (against my hotel's `Settings`), so that the changes survive across devices and reloads.
- **Optional:** As a hotel admin, I want to **select which practical-info fields** appear on the guest portal (e.g. parking, smoking policy, pet policy), so that the content is relevant to my property.
- **Optional:** As a hotel admin, I want to **upload a small gallery of hotel images**, so that guests can see the property.

**Preview and distribution**

- As a hotel admin, I want to preview the guest experience before I publish, by navigating to my hotel's guest URL inside the admin app, so that I see what guests will see without a separate preview tool.
- As a hotel admin, I want a unique URL for my portal at `/{hotel-slug}`, so that I can share it with guests.
- As a hotel admin, I want a downloadable QR code that links to the URL, so that I can print it for rooms or reception.

**Map content management**

- As a hotel admin, I want my hotel's coordinates (latitude, longitude, map zoom) to appear correctly so that the guest map is centred on the hotel with the hotel pinned.
- **Optional:** As a hotel admin, I want to **add curated points of interest** with name, category (restaurant, sightseeing, bar, café, etc.), location, opening hours, and a short note, so that guests see places I recommend.
- **Optional:** As a hotel admin, I want **admin-added POIs to be visually distinct from guest-recommended POIs** (e.g. different pin colour), so that guests know which recommendations come from the hotel.
- **Optional:** As a hotel admin, I want to **edit or remove a recommendation** later, so that my list stays current.
- **Optional:** As a hotel admin, I want to **delete a guest-recommended POI from inside the map view** (delete affordance visible only when authenticated), so that I can remove inappropriate guest suggestions.

### Guest

**Arrival**

- As a guest, I want to scan the QR code and immediately see the portal on my phone with no app install or login, so that it's effortless.
- As a guest, I want to see the hotel's branding (logo, colours, hotel name, theme background) on the portal, so that I trust I'm looking at the right hotel's content.
- As a guest, I want to see a main page with four module cards (About-the-Hotel, Map, Guest Book, Service), so that I can choose where to go next.
- As a guest, I want each module to open as a smooth slide-over with a drag-down dismiss, so that browsing feels native and reversible.

**About-the-Hotel**

- As a guest, I want to read a welcome message and key orientation information (check-in/out times, breakfast hours, Wi-Fi, reception phone), so that I have what I need without asking reception.

**Map**

- As a guest, I want to see the hotel's location on a map (OpenStreetMap, with the hotel pinned), so that I can orient myself geographically.
- As a guest, I want to pan and zoom around the surrounding area on the map, so that I can see what's near me.
- **Optional:** As a guest, I want to **filter the map by category** (e.g. show only restaurants, or only sightseeing), so that I can narrow down to what I'm looking for.
- **Optional:** As a guest, I want to **tap a point on the map to see its details** (name, hours, hotel's notes), so that I can decide whether to visit.
- **Optional:** As a guest, I want to **see the recommendations as a list** as well as on a map, so that I can scan options without geographic context if I prefer.
- **Optional:** As a guest, I want to **recommend my own point of interest on the map** with a brief note, so that other guests can benefit from my discoveries.

**Guest Book**

- As a guest, I want to read past entries from other guests, so that I get a feel for the place.
- As a guest, I want to leave a short comment that appears immediately on the guest book, so that I can share my stay with future guests. I want to be able to edit or delete my message if I have a second thought.

**Service / Chatbot**

- As a guest, I want to open a chatbot interface from the main page, so that I can ask the hotel a question or get a recommendation.
- As a guest, I want the chatbot to feel like a real-time conversation surface (a message thread with an input box), so that the experience is recognisable.
- As a guest, I want to be able to reach the hotel staff on duty when the chatbot cannot satisfy my request.
- **Optional:** As a guest, I want to **upload an image** with my guest book entry, so that I can share a moment from my stay.
- **Optional:** As a guest, I want the **chatbot to answer my questions in my language**, so that I can reach the hotel without language friction.

**Reading**

- As a guest, I want the portal to be readable on a phone without zooming, so that I can use it one-handed while walking.

---

## User flows

### Flow 1 — Hotel admin onboarding

1. Hotelier logs in with credentials provisioned by the platform (Supabase Auth). Slug is already assigned by the platform — the hotelier doesn't choose it.
2. After login, the hotelier sees **the same guest-side interface guests will see**. A draggable cog icon (visible only to admins) opens the settings menu over the live view. The menu carries panels for **Color scheme**, **Background**, **Typography**, and **Hotel info**.
3. **Brand setup.** Hotelier picks a theme from the eleven available, picks a background image and a font pair, fills in hotel name + short description + address, uploads a logo. Each change is round-tripped to the backend `Settings` row via `PATCH /settings/me`.
4. **About-the-Hotel content.** In the Hotel-info panel, the hotelier edits the welcome message and practical info (check-in/out times, breakfast hours, Wi-Fi name and password, reception phone). Saves persist to the backend; the About module renders the new values immediately to any guest viewing the portal.
5. **Preview.** Because the admin view is the guest view (plus the cog), preview is implicit — the hotelier sees changes reflected immediately, with no separate preview URL or "publish" gate.
6. **Distribution.** Portal is live at `/{hotel-slug}` (slug assigned at hotel-creation time). Hotelier downloads a QR code linking to the URL and prints it for room placement or reception display. *(QR generation pending.)*

### Flow 2 — Guest arrival and browsing

1. Guest checks in at reception. Receptionist hands over a key card and points to the QR code (in room, on the desk, or in the welcome material).
2. Guest scans the QR code with their phone camera. Browser opens the URL.
3. Portal loads showing hotel branding (logo, colours, hotel name, theme background). Main page shows **four** module cards: About-the-Hotel, Map, Guest Book, Service.
4. Guest taps a card → the card view slides up over the dashboard as a drag-to-dismiss overlay (on mobile/tablet; desktop renders a back button instead of drag-down).
5. **About-the-Hotel:** the welcome message and practical info render — sourced from the hotel's `Settings` row (and therefore reflecting whatever the admin most recently saved).
6. **Map:** an OpenStreetMap renders centred on the hotel's coordinates with the hotel pinned. Guest can pan and zoom.
7. **Guest Book:** past entries render in a list. An input field accepts a new comment, which posts immediately and appears in the same view.
8. **Service:** a chatbot-style message thread renders.
9. Guest drags the overlay down (mobile/tablet) or taps the back button (desktop) to return to the dashboard.

---

## Acceptance criteria

- A hotelier can log in, set brand (theme, background, font pair, hotel name + description + address, logo), edit About content (welcome + practical info), and see the result immediately at `/{hotel-slug}` — there is no separate publish step.
- A guest scanning the QR code on a phone sees the branded portal load in under **3 seconds** on a typical 4G connection.
- The **four** modules render as cards on the guest main page in the modules container; tapping a card opens the module view as a slide-over with drag-to-dismiss on mobile/tablet, or a back-button view on desktop.
- **About-the-Hotel** renders the welcome message and practical info from the hotel's `Settings` row and reflects admin edits immediately.
- **Map** renders OpenStreetMap centred on the hotel's coordinates with the hotel pinned.
- **Guest Book** renders past entries; guests can post new entries that appear immediately; when the admin is authenticated, each entry shows a delete affordance.
- **Service** renders the chatbot interface (message thread + input box). MVP minimum is a static interface; MVP stretch wires to the Anthropic API.
- **Two demo hotels** are configured end-to-end (Adalinos, Le Pain Doré) — both reachable at `/{hotel-slug}` with distinct brands.
- The system supports adding additional modules without modifying the platform code (architecture proven; the four-module fact and the `ModuleKind` enum at the schema level being the test).

---

## Out of scope for MVP

- Guest authentication, accounts, or profiles (a hotel-level guest PIN may be added in phase 2)
- Pre-moderation queue for Guest Book entries (posts go live immediately; admin can delete after the fact)
- Guests editing their own Guest Book entries after posting
- Curated points of interest on the map; admin-side curation; category filters; map detail panels — **may partly land as MVP stretch (see Map curation)**, otherwise phase 2
- Guest-side POI recommendations on the map — MVP stretch / phase 2
- Custom-theme option (admin choosing arbitrary primary/secondary colours)
- Hotel image gallery; "select which practical-info fields appear" (admin can edit the standard fields in MVP — but choosing which fields to show is phase 2)
- Guest image upload to the guest book
- Receptionist-moderation overlay on the chatbot (the "Sarah on duty + Alfred AI" model)
- AI-constrained predefined-answer chatbot categories (Dario's framing) — phase 2
- Module-enablement toggle UI (modules are fixed in MVP)
- Module rename UI ("Service" → "Contact" possible rename pending)
- Multilingual UI (the portal renders in whatever language the hotelier curated; LLM-based translation is phase 2)
- Slug self-editing by hotel admins (slug is assigned by the platform)
- Feedback module (distinct from Guest Book)
- Hotelier billing, subscription management, or multi-property accounts
- Native mobile apps (iOS/Android)
- Property management system (PMS) integration
- Production-grade observability, monitoring, or operational tooling
- Cloud-hosted database (local Postgres + seed file for the final demo)

---

## Open questions

- **`[OPEN]` Guest PIN code.** Some phase 2 flows (e.g. by-guest moderation of own entries) may need to identify the guest. A hotel-level PIN entered once at portal load was discussed as a lightweight identification mechanism. Decision deferred to when the first phase 2 module needing it is implemented.
- **`[OPEN]` Chatbot AI wiring before the final demo.** Jon attempting to wire the Anthropic API to Dario's static chatbot UI; landing is time-dependent. The static interface is the floor.
- **`[OPEN]` Service module name.** Arthur raised renaming "Service" → "Contact" — not decided.
- **`[OPEN]` Map curation depth for the final demo.** Admin-added POIs vs guest-recommended POIs (with distinct visual styling) and the admin's ability to delete guest POIs from inside the map view are all on the table as MVP stretch; anything not landed by Thursday rolls to phase 2.
- **`[OPEN]` QR code generation.** Generated server-side on demand or stored as a static asset? Format (PNG, SVG)? Resolution and size for printing? Implementation detail to be decided.
- **`[RESOLVED]` About-the-Hotel admin editability.** MVP — welcome message and practical info are editable via the Hotel-info panel in the settings menu; saves persist to the backend `Settings` row (decided 2026-05-12).
- **`[RESOLVED]` Guest Book moderation model.** Post-moderation: entries appear immediately on the guest book; admin can delete via a delete affordance on each entry, visible only when authenticated. No pre-moderation queue; no by-guest editing of own entries (decided 2026-05-12).
- **`[RESOLVED]` Hotel slug derivation.** Slug is assigned by the platform at hotel-creation time, not user-changeable. Currently hardcoded `adalinos`, `lepaindore` (decided 2026-05-12).
- **`[RESOLVED]` Theme persistence to backend.** MVP — theme + brand choices round-trip via `PATCH /settings/me` (Arthur wiring this cycle).
- **`[RESOLVED]` Module enablement UX for MVP.** No enablement UI in MVP; the four modules are fixed.
- **`[RESOLVED]` Number of demo hotels.** Two (Adalinos and Le Pain Doré).
- **`[RESOLVED]` Preview behaviour.** No separate preview — the admin view IS the guest view plus the cog. Changes reflect immediately.
- **`[RESOLVED]` Map provider.** Locked at OpenStreetMap; no Google Maps fallback.
- **`[RESOLVED]` Fourth module card.** Service / Chatbot is the 4th card (decided at the 2026-05-11 standup), replacing the earlier "service requests" placeholder.
- **`[RESOLVED]` Guest portal URL prefix.** `/{hotel-slug}` (decided 2026-05-12); the earlier `/h/{hotel-slug}` form is dropped.

---

## Notes on this version

- This document builds on the project proposal. Where they conflict, the project proposal is authoritative for scope; this spec is authoritative for behaviour and user-facing detail.
