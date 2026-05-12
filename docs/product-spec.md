# Product spec

*This first draft is a starting point — the team will adjust as we build.*

*Source material: project proposal (`/docs/project-proposal.md`); user stories drafted by Adam prior to scope finalisation (mapped below to the current MVP scope, with brochure stories moved to phase 2 alongside the about-us module).*

---

## Overview

A white-label, modular guest portal for independent boutique hotels. Each hotel logs into an admin to configure brand and content; each guest receives a QR code at check-in that opens a hotel-branded portal on their phone with no login or install.

The MVP delivers the platform plus one working module: a map-based local recommendations module where guests browse curated points of interest filtered by category. The architecture is module-shaped from day one so additional modules (about-us, guest book, service requests, feedback, AI concierge) can be plugged in later as configurable options.

---

## Personas

### Hotel admin

The hotelier or duty manager configuring the portal for their property. Single-property operator at a boutique hotel of 8–40 rooms. Owner-operated. Comfortable with consumer software (Instagram, email marketing tools) but not technical — no command line, no design tools beyond Canva, no CMS experience. Motivated to give guests a polished arrival experience without paying for a concierge or a custom-built app.

### Guest

A traveller staying at the hotel. Arrives at reception, receives a key card and a QR code (printed in the room or at the desk). Scans the code with their phone. Wants to find a good restaurant or sightseeing spot near the hotel without asking the receptionist. Mobile-only — no laptop. No app installs. No accounts. May be reading in a language other than the hotel's primary language, but multilingual support is phase 2 (MVP is in the language the hotelier curated).

---

## User stories

### Hotel admin — MVP

**Account and authentication**

- As a hotel admin, I want to sign up with email and password, so that I can access my portal.
- As a hotel admin, I want to log in and log out securely, so that my hotel's content is protected.
- As a hotel admin, I want to use Google or another email provider to authorise (OAuth), so that I don't need to remember another password. *[Stretch — depends on Supabase Auth provider configuration]*

**Brand setup**

- As a hotel admin, after login I want to create my hotel's portal in a single guided flow, so that I can launch quickly.
- As a hotel admin, I want the guest portal to be recognisably OUR hotel — including hotel name, short description, logo, primary and secondary colours — so that guests trust they're seeing the right hotel's content.
- As a hotel admin, I want to manage all of this without design or technical skills, so that I'm not blocked by tooling I don't know.

**Module enablement**

- As a hotel admin, I want to choose which modules appear in my guest portal, so that the portal reflects the experience I want guests to have.

*For MVP, only the local recommendations module is implemented. The module enablement UI exists but lists one option.*

**Local recommendations content** *(MVP module)*

- As a hotel admin, I want to add curated points of interest with name, category (restaurant, sightseeing, bar, café, etc.), location, opening hours, and a short note, so that guests see only places I recommend.
- As a hotel admin, I want to edit or remove a recommendation later, so that my list stays current.
- As a hotel admin, I want to preview the guest experience before I publish, so that I see what guests will see.

**Distribution**

- As a hotel admin, I want a unique URL for my portal, so that I can share it with guests.
- As a hotel admin, I want a downloadable QR code that links to the URL, so that I can print it for rooms or reception.

### Guest — MVP

**Arrival**

- As a guest, I want to scan the QR code and immediately see the portal on my phone with no app install or login, so that it's effortless.
- As a guest, I want to see the hotel's branding (logo, colours, name) on the portal, so that I trust I'm looking at the right hotel's content.

**Browsing local recommendations**

- As a guest, I want to see all recommended places on a map, so that I can see what's near me geographically.
- As a guest, I want to filter the map by category (e.g. show only restaurants, or only sightseeing), so that I can narrow down to what I'm looking for.
- As a guest, I want to tap a point on the map to see its details (name, hours, hotel's notes), so that I can decide whether to visit.
- As a guest, I want to see the recommendations as a list as well as on a map, so that I can scan options without geographic context if I prefer.

**Reading**

- As a guest, I want the portal to be readable on a phone without zooming, so that I can use it one-handed while walking.

### Hotel admin — Phase 2 (post-MVP, time permitting)

These stories describe modules deferred from MVP. The platform supports them; specific implementation deferred to cycle 2.

- As a hotel admin, I want to **write a welcome message** that guests see when they open the portal. *(About-us module)*
- As a hotel admin, I want to **provide key practical info** — check-in/out times, breakfast hours, Wi-Fi name and password, reception phone — so that guests don't need to ask reception for routine information. *(About-us module)*
- As a hotel admin, I want to **select which practical info fields** appear on the guest portal (e.g. parking, smoking policy, pet policy), so that the content is relevant to my property. *(About-us module)*
- As a hotel admin, I want to **upload a small gallery of hotel images**, so that guests can see the property. *(About-us module)*
- As a hotel admin, I want **structured guest feedback during the stay** with hotel-side moderation. *(Feedback module)*
- As a hotel admin, I want **guest-side reviews of recommended venues**, so that future guests benefit from past guest experiences. *(Guest book module)*
- As a hotel admin, I want **lightweight in-room service requests** (housekeeping, late check-out) routed to reception. *(Service requests module)*

### Guest — Phase 2

- As a guest, I want to read a welcome message and key orientation information on arrival. *(About-us module)*
- As a guest, I want to ask a conversational AI concierge questions in any language and receive answers grounded in the hotel's curated content. *(AI concierge module)*

---

## User flows

### Flow 1 — Hotel admin onboarding (MVP)

1. Hotelier signs up with email and password (Supabase Auth).
2. After login, lands on an empty portal configuration screen with a guided checklist: brand setup, enable a module, add content, preview, publish.
3. **Brand setup.** Hotelier uploads logo, picks primary and secondary colours, enters hotel name and short description.
4. **Module enablement.** Hotelier sees the available modules (MVP: just local recommendations) and toggles them on for their portal.
5. **Content management.** Hotelier adds local recommendations one at a time: name, category, location (search or click on map), hours, short note.
6. **Preview.** Hotelier sees what guests will see — branded portal with the recommendations rendered on a map.
7. **Publish.** Hotelier confirms; portal goes live at `/h/{hotel-slug}`.
8. **Distribute.** Hotelier downloads a QR code linking to the URL and prints it for room placement or reception display.

### Flow 2 — Guest arrival and browsing (MVP)

1. Guest checks in at reception. Receptionist hands over a key card and points to the QR code (in room, on the desk, or in the welcome material).
2. Guest scans the QR code with their phone camera. Browser opens the URL.
3. Portal loads showing hotel branding (logo, colours, hotel name). Guest sees the local recommendations module as the active page.
4. Guest sees an interactive map centred on the hotel with category-filter checkboxes (e.g. restaurants, sightseeing, bars). All points visible by default.
5. Guest unchecks "sightseeing" to filter down to restaurants, bars, and cafés. Map redraws.
6. Guest taps a marker. Detail panel opens showing place name, opening hours, hotel's note, and a link to navigate (handed off to the device's default map app).
7. Guest closes the detail and continues browsing or navigates to the place.

---

## Acceptance criteria

The MVP is considered done when:

- A hotelier can sign up, configure brand, add at least 5 local recommendations, and publish their portal in under 15 minutes
- A guest scanning the QR code on a phone sees the branded portal load in under 3 seconds on a typical 4G connection
- The map renders, category filters work, and tapping a marker shows the recommendation details
- One or two demo hotels are configured end-to-end with distinct brands and content
- The system supports adding additional modules without modifying the platform code (architecture proven, even if no second module is shipped)

---

## Out of scope for MVP

- Guest authentication, accounts, or profiles (a hotel-level guest PIN may be added if needed — see open questions)
- Payments, bookings, or any commerce functionality
- Multilingual UI (the portal renders in whatever language the hotelier has curated; LLM-based translation is phase 2)
- AI conversational concierge (phase 2)
- Hotelier billing, subscription management, or multi-property accounts
- Native mobile apps (iOS/Android)
- Property management system (PMS) integration
- Production-grade observability, monitoring, or operational tooling

---

## Open questions

- **`[OPEN]` Guest PIN code.** Some flows in phase 2 (e.g. service requests, guest book reviews) need to identify the guest. A hotel-level PIN entered once at portal load was discussed as a lightweight identification mechanism. Decision deferred to when the first phase 2 module needing it is implemented.
- **`[OPEN]` Number of demo hotels.** Proposal says "one or two." Decision depends on cycle 1 capacity.
- **`[OPEN]` Module enablement UX for the MVP.** With only one module to enable, the UI risks looking pointless. Options: hide the section entirely until a second module exists; show it with the one option pre-enabled; show it with copy explaining future modules will appear. To be decided during implementation.
- **`[OPEN]` Preview behaviour.** The preview flow is described as "see what guests will see." Whether this is a separate preview URL, an in-admin embedded view, or a "publish to staging" step is to be decided during implementation.
- **`[OPEN]` QR code generation.** Generated server-side on demand or stored as a static asset? Format (PNG, SVG)? Resolution and size for printing? Implementation detail to be decided.
- **`[OPEN]` Hotel slug.** How is `{hotel-slug}` derived — auto-generated from hotel name, hotelier-chosen, or both? Uniqueness handling? Decision needed before the URL is part of the published portal.

---

## Notes on this draft

- User stories are drawn from the team's pre-scope-finalisation draft and re-mapped to the current MVP. Brochure stories (welcome message, practical info, gallery) are now phase 2 stories under the about-us module.
- Acceptance criteria are deliberately lightweight — they describe what "done" looks like in observable terms rather than line-item validation.
- This document is building on the project proposal. Where they conflict, the project proposal is authoritative for scope; this spec is authoritative for behaviour and user-facing detail.
