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
            content: {},
          },
          {
            view: 'guestbook',
            position: 2,
            content: {},
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
            content: {},
          },
          {
            view: 'guestbook',
            position: 2,
            content: {},
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

  // ════════ POIs ═════════════════════════════════════════════════════
  const pois = [
    // Le Pain Doré (H003)
    { id: 'P001', hotelId: 'H003', category: 'restaurant' as const, latitude: 48.8556, longitude: 2.3350, name: 'Café de Flore', comment: 'Our favourite spot for morning coffee — try the croissants.', source: 'admin' as const },
    { id: 'P002', hotelId: 'H003', category: 'sports' as const, latitude: 48.8480, longitude: 2.3338, name: 'Tennis du Luxembourg', comment: 'Friendly courts in the Jardin du Luxembourg. Reservations available at reception.', source: 'admin' as const },
    { id: 'P003', hotelId: 'H003', category: 'attraction' as const, latitude: 48.8606, longitude: 2.3376, name: 'Louvre Museum', comment: 'Skip the queue with our hotel ticket service.', source: 'admin' as const },
    { id: 'P004', hotelId: 'H003', category: 'shopping' as const, latitude: 48.85122019977861, longitude: 2.324485051407109, name: 'Le Bon Marché', comment: "Paris's oldest department store — perfect for unique gifts.", source: 'admin' as const },
    { id: 'P009', hotelId: 'H003', category: 'attraction' as const, latitude: 48.828471574957554, longitude: 2.3215688284456877, name: 'Jon Nilsen residence', comment: 'The famous artist Jon lived here - beware of the queue', source: 'admin' as const },
    // Adalino's (H001)
    { id: 'P005', hotelId: 'H001', category: 'restaurant' as const, latitude: 46.7782, longitude: 12.9203, name: 'Berghütte Alpenrose', comment: 'Traditional mountain hut with excellent local cuisine and Alpine views.', source: 'admin' as const },
    { id: 'P006', hotelId: 'H001', category: 'sports' as const, latitude: 46.7801, longitude: 12.9250, name: 'Skischule Lienz', comment: 'Our preferred ski school. Mention our hotel for a discount.', source: 'admin' as const },
    { id: 'P007', hotelId: 'H001', category: 'attraction' as const, latitude: 46.7745, longitude: 12.9102, name: 'Schloss Bruck', comment: "Medieval castle with stunning views. Don't miss the regional museum.", source: 'admin' as const },
    { id: 'P008', hotelId: 'H001', category: 'shopping' as const, latitude: 46.7762, longitude: 12.9157, name: 'Lienz Hauptmarkt', comment: "Weekly farmers' market with regional produce and Tirolean crafts.", source: 'admin' as const },
  ]
  for (const p of pois) {
    await prisma.poi.upsert({ where: { id: p.id }, update: {}, create: p })
  }
  console.log(`  ✓ ${pois.length} POIs`)

  // ════════ Reviews ══════════════════════════════════════════════════
  const reviews = [
    // Le Pain Doré (H003)
    { id: 'R001', hotelId: 'H003', type: 'map' as const, poiId: 'P001', rating: 5, comment: 'Best croissants in the 6th — flaky and fresh.', reviewerName: 'Marie' },
    { id: 'R002', hotelId: 'H003', type: 'map' as const, poiId: 'P001', rating: 4, comment: 'Lovely atmosphere, a bit pricey but worth it.', reviewerName: null },
    { id: 'R003', hotelId: 'H003', type: 'map' as const, poiId: 'P003', rating: 5, comment: 'Skip-the-queue ticket was a lifesaver.', reviewerName: 'Tom' },
    { id: 'R004', hotelId: 'H003', type: 'guestbook' as const, poiId: null, rating: null, comment: 'A magical stay in Paris — Alfred made everything feel effortless. We will be back.', reviewerName: 'Sarah' },
    { id: 'R005', hotelId: 'H003', type: 'guestbook' as const, poiId: null, rating: null, comment: 'Beautiful room overlooking the courtyard. Breakfast was top notch.', reviewerName: 'James' },
    { id: 'R006', hotelId: 'H003', type: 'guestbook' as const, poiId: null, rating: null, comment: 'Friendly staff and a perfect location near the Jardin du Luxembourg.', reviewerName: null },
    // Adalino's (H001)
    { id: 'R007', hotelId: 'H001', type: 'map' as const, poiId: 'P005', rating: 5, comment: 'The Knödel were incredible. Cosy hut with stunning views.', reviewerName: 'Klaus' },
    { id: 'R008', hotelId: 'H001', type: 'map' as const, poiId: 'P006', rating: 4, comment: 'Great instructor for our beginner kids — patient and fun.', reviewerName: 'Anna' },
    { id: 'R009', hotelId: 'H001', type: 'guestbook' as const, poiId: null, rating: null, comment: 'A perfect base for skiing the Lienzer Dolomiten. Warm welcome from the team.', reviewerName: 'Lukas' },
    { id: 'R010', hotelId: 'H001', type: 'guestbook' as const, poiId: null, rating: null, comment: 'The sauna after a long ski day — pure bliss.', reviewerName: null },
  ]
  for (const r of reviews) {
    await prisma.review.upsert({ where: { id: r.id }, update: {}, create: r })
  }
  console.log(`  ✓ ${reviews.length} reviews`)

  console.log('Seed complete.')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
