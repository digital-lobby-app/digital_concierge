// backend/prisma/seed.ts
//
// Demo data for the three hotels (Adam's, Dario's, Jon's).
// DRAFT — placeholder content, to be filled in with Arthur.
//
// Open Qs flagged inline. Anything marked TBD is for Arthur to confirm
// or fill in; anything left as a comment is a structural decision we
// might want to revisit together.

import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

// ─── Theme combos ─────────────────────────────────────────────────────
// TBD with Arthur:
//   - Names of palette categories (his Slack mentioned "ocean palette")
//   - Names of bgImages categories ("space-bg-imgs")
//   - Names of fontPair categories ("pre-historic-font")
//   - Which combo each hotel gets (so flipping between hotels looks
//     visibly different in the demo)

// ─── About-module content shape ───────────────────────────────────────
// The shape of `content` on the About module is module-owned. Below is
// a proposed shape based on the user stories' "must include" list
// (welcome / check-in / breakfast / wifi / reception). Arthur may want
// to add, remove, or rename fields to match what he's designing.
// User stories also mention OPTIONAL fields the admin can toggle on
// per-hotel (parking, smoking, pets) — left commented in for now.

async function main() {
  console.log('Seeding…')

  // ════════ HOTEL 1 — Adam's ════════════════════════════════════════
  const adam = await prisma.hotel.upsert({
    where: { slug: 'adam-hotel' },     // <- slug locks the hotel's URL: /adam-hotel
    update: {},
    create: {
      slug: 'adam-hotel',
      name: '',                        // TBD
      description: '',                 // TBD
      address: '',                     // TBD
      logoUrl: '',                     // TBD — path to static asset, e.g. /logos/adam.png

      settings: {
        create: {
          palette: '',                 // TBD
          bgImages: '',                // TBD
          fontPair: '',                // TBD
        },
      },

      modules: {
        create: [
          {
            kind: 'about',
            position: 0,
            content: {
              welcomeMessage: '',      // TBD
              checkIn: '',             // e.g. '15:00'
              checkOut: '',            // e.g. '11:00'
              breakfast: '',           // e.g. '07:30 – 10:30'
              wifiName: '',
              wifiPassword: '',
              receptionPhone: '',
              // Optional (user stories: admin chooses whether to show):
              // parking: '',
              // smoking: '',
              // pets: '',
            },
          },
          {
            kind: 'map',
            position: 1,
            content: {
              centerLat: 0,            // TBD — hotel's lat
              centerLng: 0,            // TBD — hotel's lng
              zoom: 14,
              pois: [],                // empty for MVP — generic OSM tiles
            },
          },
          {
            kind: 'guestbook',
            position: 2,
            content: {
              entries: [],             // empty — guests haven't written any
            },
          },
        ],
      },
    },
  })
  console.log(`  ✓ ${adam.slug}`)

  // ════════ HOTEL 2 — Dario's ════════════════════════════════════════
  const dario = await prisma.hotel.upsert({
    where: { slug: 'dario-hotel' },
    update: {},
    create: {
      slug: 'dario-hotel',
      name: '',
      description: '',
      address: '',
      logoUrl: '',

      settings: {
        create: {
          palette: '',
          bgImages: '',
          fontPair: '',
        },
      },

      modules: {
        create: [
          {
            kind: 'about',
            position: 0,
            content: {
              welcomeMessage: '',
              checkIn: '',
              checkOut: '',
              breakfast: '',
              wifiName: '',
              wifiPassword: '',
              receptionPhone: '',
            },
          },
          {
            kind: 'map',
            position: 1,
            content: {
              centerLat: 0,
              centerLng: 0,
              zoom: 14,
              pois: [],
            },
          },
          {
            kind: 'guestbook',
            position: 2,
            content: {
              entries: [],
            },
          },
        ],
      },
    },
  })
  console.log(`  ✓ ${dario.slug}`)

  // ════════ HOTEL 3 — Jon's ══════════════════════════════════════════
  const jon = await prisma.hotel.upsert({
    where: { slug: 'jon-hotel' },
    update: {},
    create: {
      slug: 'jon-hotel',
      name: '',
      description: '',
      address: '',
      logoUrl: '',

      settings: {
        create: {
          palette: '',
          bgImages: '',
          fontPair: '',
        },
      },

      modules: {
        create: [
          {
            kind: 'about',
            position: 0,
            content: {
              welcomeMessage: '',
              checkIn: '',
              checkOut: '',
              breakfast: '',
              wifiName: '',
              wifiPassword: '',
              receptionPhone: '',
            },
          },
          {
            kind: 'map',
            position: 1,
            content: {
              centerLat: 0,
              centerLng: 0,
              zoom: 14,
              pois: [],
            },
          },
          {
            kind: 'guestbook',
            position: 2,
            content: {
              entries: [],
            },
          },
        ],
      },
    },
  })
  console.log(`  ✓ ${jon.slug}`)

  console.log('Seed complete.')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
