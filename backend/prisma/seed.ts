// SEED FILE — populates the local DB with three demo hotels for development.
//
// First-time setup (after cloning):
//   cp .env.example .env  &  fill in DATABASE_URL + Supabase keys. THEN:
//   npm install                — auto-runs `prisma generate` via postinstall
//   npx prisma migrate dev     — creates the tables
//   npx prisma db seed         — runs THIS file, fills tables with demo data
//
// The commands and what they do:
//   prisma migrate dev    — applies any new migrations to your DB.
//                           Run after pulling someone else's schema changes.
//   prisma db seed        — runs this file. Tables must already exist.
//                           Won't overwrite existing rows (we use `upsert`
//                           with empty `update: {}`).
//   prisma migrate reset  — nukes DB, re-runs all migrations, re-seeds.
//                           when in doubt just reset - at small scale isn't a problem.

import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding…')

  // ════════ HOTEL 1 — Adam's ════════════════════════════════════════
  const adam = await prisma.hotel.upsert({
    where: { slug: 'adam-hotel' },     
    update: {},
    create: {
      slug: 'adam-hotel',
      name: "Adalino's Bunny Hotelino",                      
      description: 'The best rabbit getaway carrots can buy.',                 
      address: '11 Sonnenreich Weg, Osttirol, Österreich',                     
      logoUrl: '',                     // TBD — path to static asset, e.g. /logos/adam.png
      latitude: 46.77694526380854,
      longitude: 12.917673716739909,
      mapZoom: 14,

      settings: {
        create: {
          colorPalette: '',            // TBD
          bgImages: '',                // TBD
          fontPair: '',                // TBD
        },
      },

      modules: {
        create: [
          {
            view: 'about',
            position: 0,
            content: {
              welcomeMessage: "Welcome to our wooden huts in the hills bordering Italy. It's a fine day to be a rabbit. We're thrilled you chose to join us where you're blessed with our great vistas and vegetation. NOTE: Strict zero bird policy. All birds will be shot on-site.",      // TBD
              checkIn: '15:00',            
              checkOut: '09:45',            
              breakfast: '05:00 - 08:30',           
              wifiName: 'jajarabbit',
              wifiPassword: 'welikecarrots',
              receptionPhone: '+43 664 123 4567',
              // Optional (admin chooses whether to show, configurable; other card-options, e.g. pets)
            },
          },
          {
            view: 'map',
            position: 1,
            content: {
              pois: [],                // empty for MVP — generic OSM tiles, no curated points
            },
          },
          {
            view: 'guestbook',
            position: 2,
            content: {
              entries: [],             // empty to begin
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
      // latitude / longitude / mapZoom: TBD from Dario

      settings: {
        create: {
          colorPalette: '',
          bgImages: '',
          fontPair: '',
        },
      },

      modules: {
        create: [
          {
            view: 'about',
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
            view: 'map',
            position: 1,
            content: {
              pois: [],
            },
          },
          {
            view: 'guestbook',
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
      name: 'Le Pain Doré',
      description: 'A baguette-themed boutique hotel in the heart of Paris.',
      address: 'Paris, France',        // TBD — refine with Jon
      logoUrl: '',
      latitude: 48.85367587564214,
      longitude: 2.3364627421438335,
      mapZoom: 14,

      settings: {
        create: {
          colorPalette: '',
          bgImages: '',
          fontPair: '',
        },
      },

      modules: {
        create: [
          {
            view: 'about',
            position: 0,
            content: {
              welcomeMessage: 'Bienvenue au Pain Doré — every guest receives a fresh baguette on arrival.',
              checkIn: '15:00',
              checkOut: '11:00',
              breakfast: '07:00 - 10:00',
              wifiName: 'PainDoreGuest',
              wifiPassword: 'baguette2026',
              receptionPhone: '+33 1 23 45 67 89',
            },
          },
          {
            view: 'map',
            position: 1,
            content: {
              pois: [],
            },
          },
          {
            view: 'guestbook',
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
