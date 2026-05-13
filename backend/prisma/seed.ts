// SEED FILE — populates the local DB with three demo hotels for development. To use:
// fill in DATABASE_URL + Supabase keys. THEN:
//   npm install                — auto-runs `prisma generate` via postinstall
//   npx prisma migrate dev     — creates the tables
//   npx prisma db seed         — runs THIS file, fills tables with demo data. hardocdes user id. adds user emails we have.
//
// also note that:
//   prisma migrate reset  — nukes DB, re-runs all migrations, re-seeds. When in doubt, just reset. 

import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Seeding…')

  // ════════ HOTEL 1 — Adam's ════════════════════════════════════════
  const adam = await prisma.hotel.upsert({
    where: { slug: 'adalinos' },
    update: {},
    create: {
      id: 'H001',                      // hardcoded for MVP
      slug: 'adalinos',
      name: "Adalino's Bunny Hotelino",                      
      description: 'The best rabbit getaway carrots can buy.',                 
      address: '11 Sonnenreich Weg, Osttirol, Österreich',                     
      logoUrl: '',                     // TBD — path to static asset, e.g. /logos/adam.png
      latitude: 46.77694526380854,
      longitude: 12.917673716739909,
      mapZoom: 15,

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
              pois: [],                // empty for MVP
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
  console.log(`  ✓ ${adam.slug}  (${adam.id})`)

  // ════════ HOTEL 3 — Jon's ══════════════════════════════════════════
  const jon = await prisma.hotel.upsert({
    where: { slug: 'lepaindore' },
    update: {},
    create: {
      id: 'H003',
      slug: 'lepaindore',
      name: 'Le Pain Doré',
      description: 'A baguette-themed boutique hotel in the heart of Paris.',
      address: 'Paris, France',        
      logoUrl: '',
      latitude: 48.85367587564214,
      longitude: 2.3364627421438335,
      mapZoom: 15,

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
  console.log(`  ✓ ${jon.slug}  (${jon.id})`)

  await prisma.user.upsert({
    where: { email: 'alfred@adalinos.com' },
    update: {},
    create: {
      supabaseUserId: '5ffdde55-255b-46d2-9b21-56c7925e7e21',
      email: 'alfred@adalinos.com',
      hotelId: 'H001',
    },
  })

  await prisma.user.upsert({
    where: { email: 'alfred@lepaindore.fr' },
    update: {},
    create: {
      supabaseUserId: '02e9ddd3-a38f-44f7-adee-db4f4ab3a0e7',
      email: 'alfred@lepaindore.fr',
      hotelId: 'H003',
    },
  })

  console.log('Seed complete.')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
