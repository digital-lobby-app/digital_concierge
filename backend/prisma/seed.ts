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

  const adalinosFaqs = [
    // Arrival & departure
    { q: 'Can I check in before 15:00?', a: "Early check-in depends on room availability. Please ask reception on arrival — if your hut isn't ready, we'll happily store your bags and offer a warm drink." },
    { q: 'Is late check-out possible?', a: 'We can usually offer late check-out until 12:00 for a small fee, subject to availability. Please confirm with reception the evening before departure.' },
    { q: 'Can I leave my luggage after check-out?', a: 'Yes — luggage storage is free of charge. Just drop your bags at reception and pick them up whenever suits you that day.' },
    { q: 'What if I arrive after reception closes?', a: "Our reception is staffed 24 hours a day. Just ring the bell at the front door if it's locked late at night." },
    { q: 'How do I get keys for my hut after hours?', a: 'Reception is staffed around the clock; the night-duty team will hand you the keys whenever you arrive.' },
    { q: 'Can I extend my stay during my visit?', a: 'Of course — please ask reception as early as possible. Availability can be tight in ski season, so the sooner the better.' },
    { q: 'What time should I leave the hut on departure day?', a: 'Check-out is at 09:45. Please leave the keys at reception or in your hut on the way out.' },
    { q: 'Can I check in early if I arrive on an early train?', a: "We'll do our best. Bag storage is always available, and you're welcome to use the lobby and breakfast room while you wait." },
    // Rooms
    { q: 'Are the huts non-smoking?', a: 'Yes, all huts are strictly non-smoking. There is a designated smoking area outside next to the firewood shed.' },
    { q: 'Can I get connecting huts for my family?', a: "Several of our huts share an internal connecting door. Please request when booking and we'll do our best to assign one." },
    { q: 'Can you add an extra bed or cot to my hut?', a: 'Yes — extra single beds and travel cots are available on request, subject to room size. Cots are free of charge for under-twos.' },
    { q: 'Are the huts hypoallergenic?', a: 'We use natural wool and cotton bedding. Hypoallergenic pillows and duvets are available — just let reception know in advance.' },
    { q: 'Do the huts have a view of the mountains?', a: 'Most huts face the Lienzer Dolomiten. South-facing huts get the best afternoon sun — request when booking.' },
    { q: 'How do I control the heating in my hut?', a: 'Each hut has a small wood stove and an electric thermostat near the door. Reception can light the stove for you on arrival.' },
    { q: 'Is there a TV in the hut?', a: 'Each hut has a small television with international channels, hidden inside the wooden cabinet — quite the treasure hunt!' },
    { q: 'Are extra towels and toiletries available?', a: 'Yes — fresh towels are changed daily and extra toiletries are stocked in your hut. More on request from reception.' },
    // Breakfast & dining
    { q: "What's served at breakfast?", a: 'A generous Tirolean buffet — fresh breads, local cheeses and meats, eggs, yoghurt, fruit, pastries, plus coffee, tea and juices. Hot dishes available on request.' },
    { q: 'Do you offer vegetarian or vegan breakfast options?', a: 'Yes — we always have vegetarian options at the buffet, and vegan items (oat milk, plant-based spreads, fruit, nuts) on request.' },
    { q: 'Can you accommodate gluten-free or other dietary needs?', a: 'Yes — gluten-free, lactose-free, and other dietary needs are no problem. Please let us know in advance so we can prepare accordingly.' },
    { q: 'Is room service available?', a: "We don't offer full room service, but breakfast in your hut can be arranged for a small fee. Just request the night before." },
    { q: "Is there a kids' menu?", a: 'We can prepare child-friendly portions and simple dishes (pasta, schnitzel, fruit) on request — just ask any team member.' },
    { q: 'Can I have dinner at the hotel?', a: "We don't run a restaurant on site, but reception can recommend nearby spots and book a table for you." },
    // Amenities
    { q: 'Is there a sauna?', a: 'Yes — our wood-fired Tirolean sauna is open 16:00 to 21:00 daily. Towels are provided; access is free for guests.' },
    { q: 'Do you have a swimming pool?', a: "We don't have an indoor pool, but a small heated outdoor hot tub is open year-round, just outside the sauna." },
    { q: 'Is there a gym?', a: 'We have a small fitness corner with weights, a yoga mat, and a stationary bike. Open 06:00 to 22:00 daily.' },
    { q: 'Can I book a massage?', a: 'Yes — a local massage therapist visits twice a week. Reception can book you in for a Tirolean or deep-tissue session.' },
    { q: 'Is there a meeting or business room?', a: 'We have a small meeting room for up to 8 people, with whiteboard and screen. Reception can book it for you.' },
    { q: 'Where can I store ski gear?', a: 'Our ski room is heated, with boot dryers and individual lockers for each guest. Located next to reception.' },
    // Connectivity
    { q: 'Is wifi free, and does it reach my hut?', a: 'Yes — wifi is free and reaches all huts. Network "jajarabbit", password "welikecarrots". Speed is good for streaming.' },
    { q: 'Can I print something at reception?', a: 'Yes — printing and scanning are free for guests. Just bring your file on a USB stick or email it to reception.' },
    { q: 'Is there a public computer for guests?', a: 'We have one shared laptop in the lobby for quick check-ins and printing.' },
    { q: 'How fast is the wifi?', a: 'Around 100 Mbps down, 30 Mbps up — fine for video calls and streaming.' },
    // Family & kids
    { q: 'Are children welcome?', a: "Absolutely — we're a family-friendly hut hotel. Cots, high chairs, child cutlery, and games are all available." },
    { q: 'Do you provide a high chair at breakfast?', a: "Yes — please ask any team member at breakfast and we'll bring one to your table." },
    { q: 'Is babysitting available?', a: 'We work with two trusted local babysitters. Please ask reception at least 24 hours in advance.' },
    { q: "Is there a kids' play area?", a: 'A small play corner in the lobby with books, toys, and crayons. Outdoor sledges are free to borrow in winter.' },
    { q: 'Can you arrange ski lessons for kids?', a: 'Yes — we partner with Skischule Lienz, who offer beginner lessons for children. Reception can book on your behalf.' },
    // Pets
    { q: 'Are dogs allowed?', a: 'Yes, well-behaved dogs are welcome (max 2 per hut), with a small daily cleaning fee. Dog beds and bowls available on request.' },
    { q: 'Are there any pet restrictions?', a: 'We have a strict zero-bird policy on the property — birds are not permitted. Cats and dogs are welcome in designated huts.' },
    { q: 'Where can I walk my dog?', a: 'Our property opens directly onto walking trails through the surrounding meadows and forest. Dog waste bags are at the main entrance.' },
    // Parking
    { q: 'Is parking available at the hotel?', a: 'Yes — free outdoor parking is available for all guests on a first-come basis.' },
    { q: 'Do you have indoor or covered parking?', a: 'We have a small carport for 6 cars, available for an extra fee. Reservations recommended in winter.' },
    { q: 'Is there an EV charging station?', a: 'Yes — we have one Type 2 charger (22 kW) in the carport. Free for guests; please coordinate use with reception.' },
    { q: 'Is there a height limit for vehicles?', a: 'The carport has a 2.1 m clearance. Outdoor parking has no restrictions.' },
    // Practical / housekeeping
    { q: 'Is laundry service available?', a: 'Yes — same-day laundry and pressing if dropped at reception before 09:00. Pricing per item, list available at reception.' },
    { q: 'Do you offer dry cleaning?', a: 'Yes — typically returned within 48 hours. Drop off at reception any time.' },
    { q: 'Can I borrow an iron and ironing board?', a: 'Of course — both are available from reception, free to borrow.' },
    { q: 'Is there a hairdryer in the hut?', a: 'Yes — every hut has a hairdryer in the bathroom. Travel adapters available at reception if needed.' },
    { q: 'What plug adapter do I need?', a: 'Austria uses Type F (European 2-pin) sockets at 230V. Adapters available to borrow at reception.' },
    { q: 'Where is the nearest ATM or currency exchange?', a: 'The nearest ATM is in Lienz town centre, 2 km away. Reception can advise on exchange options.' },
    { q: 'Can I get my shoes shined?', a: "Yes — leave them outside your hut door before 22:00 and they'll be returned the next morning. Free service." },
    { q: 'Where can I refill my water bottle?', a: 'Tap water is excellent throughout the property — perfectly safe to drink, fresh from Alpine springs.' },
    // Accessibility
    { q: 'Is the hotel wheelchair accessible?', a: 'Two of our ground-floor huts are step-free and have wider doorways. Please request when booking; reception can advise on accessibility throughout.' },
    { q: 'Is there an elevator?', a: 'All our huts are single-storey and step-free at ground level. The main building has one floor only.' },
    { q: 'Do you have accessible bathrooms?', a: 'Our two accessible huts have adapted bathrooms with grab rails and roll-in showers.' },
    // Safety & lost-and-found
    { q: 'Is there a safe in the hut?', a: 'Yes — every hut has a small in-room safe, large enough for a laptop and documents. Reception can help if you need a code reset.' },
    { q: 'I lost something — what do I do?', a: 'Please ask reception or email lostandfound@adalinos.example. We hold lost items for 30 days.' },
    { q: 'Is there a doctor or pharmacy nearby?', a: "A pharmacy and doctor's office are in Lienz town, 2 km away. For emergencies dial 112; reception can also help arrange transport." },
    // Billing & policies
    { q: "What's your cancellation policy?", a: 'Free cancellation up to 14 days before arrival. Within 14 days, the first night is charged. Policies vary by rate — check your booking confirmation.' },
    { q: 'Do you require a deposit?', a: 'A deposit is taken at booking depending on the rate. Full payment is settled at check-out unless paid in advance.' },
    { q: 'Which payment methods do you accept?', a: 'Major credit and debit cards (Visa, MasterCard, Amex), bank transfer, and cash (Euro).' },
    { q: 'Can I get an itemised receipt or invoice?', a: 'Yes — we issue a detailed invoice on request. Just ask at check-out and tell us any company name or VAT number you need on it.' },
    { q: 'Is there a city tax?', a: 'Yes — Osttirol charges a small daily Kurtaxe per adult, added to your bill at check-out.' },
  ]

  const lepaindoreFaqs = [
    // Arrival & departure
    { q: 'Can I check in before 15:00?', a: "We'll happily store your luggage and serve you a fresh baguette in the lobby while we prepare your room. Early check-in subject to availability." },
    { q: 'Is late check-out possible?', a: "Late check-out until 14:00 may be possible for a small fee, depending on the day's bookings. Ask reception the evening before." },
    { q: 'Can I leave my luggage after check-out?', a: 'Of course — luggage storage is free until late evening. Drop your bags at reception and explore Paris baggage-free.' },
    { q: 'What if I arrive late at night?', a: 'Reception is staffed 24 hours. Ring the night bell if the door is locked — Alfred or a team member will let you in.' },
    { q: 'How do I collect my room key after hours?', a: 'Reception is open round the clock — keys are handed over in person whenever you arrive.' },
    { q: 'Can I extend my stay?', a: "We'll always try to accommodate. Please ask reception as soon as possible — Paris bookings can be tight, especially around fashion week." },
    { q: 'What time is check-out?', a: 'Check-out is at 11:00. Late check-out can sometimes be arranged for a small fee.' },
    { q: "I'm arriving by train — can I store my luggage early?", a: 'Absolutely. Luggage storage is free, available all day, even before you officially check in.' },
    // Rooms
    { q: 'Are the rooms non-smoking?', a: 'Yes — all rooms are strictly non-smoking. A small terrace by the courtyard is available for smokers.' },
    { q: 'Can I book connecting rooms?', a: 'Yes — several pairs of rooms have a connecting door. Please request when booking.' },
    { q: 'Can I add an extra bed or cot?', a: 'Travel cots are free for under-twos. Extra single beds available in larger rooms — please ask in advance.' },
    { q: 'Do you have hypoallergenic bedding?', a: 'Yes — hypoallergenic pillows and duvets are available on request, free of charge.' },
    { q: "What's the difference between courtyard and street rooms?", a: 'Courtyard rooms are quieter and look onto a small interior garden. Street-facing rooms get more morning light and a view of the boulevard.' },
    { q: 'How do I control room temperature?', a: "Each room has a thermostat by the door — adjust to your preference. Reception can help if it isn't responding." },
    { q: 'Is there a TV in the room?', a: 'Yes — every room has a flat-screen with international channels and Chromecast for streaming from your phone.' },
    { q: 'Can I get extra towels or toiletries?', a: 'Yes — daily housekeeping refreshes towels, and extras (toothbrush, slippers, razor) are available from reception.' },
    // Breakfast & dining
    { q: "What's served at breakfast?", a: 'A French breakfast buffet — freshly baked baguette and pastries from our own oven, butter, jams, cheeses, charcuterie, fruit, yoghurt, plus coffee, tea, and juices.' },
    { q: 'Are there vegetarian or vegan options at breakfast?', a: 'Yes — vegetarian options are always available at the buffet, and vegan items (plant-based milks, fruit, nut butters, vegan pastries) on request.' },
    { q: 'Can you cater for gluten-free or other dietary needs?', a: 'Of course — gluten-free, lactose-free, halal and other dietary needs welcome. Please let us know in advance so we can prepare.' },
    { q: 'Is room service available?', a: 'A light room service menu (continental breakfast, sandwiches, cheese plates) is available from 07:00 to 22:00.' },
    { q: "Is there a kids' menu?", a: 'Yes — child-friendly portions and simple dishes are available at breakfast and via room service. Just ask.' },
    { q: 'Can I take a fresh baguette to-go?', a: "Yes — we'll wrap a fresh baguette for you at reception any time after 07:00. Free for guests." },
    // Amenities
    { q: 'Is there a swimming pool?', a: "We don't have a pool, but there's a small steam room and sauna in the spa, free for guests, open 09:00 to 21:00." },
    { q: 'Do you have a fitness room?', a: 'Yes — a compact gym with cardio machines, free weights, and yoga mats. Open 24 hours, accessible by room key.' },
    { q: 'Can I book a spa treatment?', a: 'Yes — our spa offers massages and facials. Reception can book on your behalf; treatments run 11:00 to 19:00.' },
    { q: 'Is there a meeting room?', a: 'We have a small private salon for up to 10 people, with screen and whiteboard. Half- and full-day bookings via reception.' },
    { q: 'Is there a library or quiet area?', a: 'Our reading lounge is open all day with French and English books, newspapers, and a fireplace in winter.' },
    { q: 'Can I borrow an umbrella?', a: "Yes — umbrellas are free to borrow at reception, in case Paris's weather turns on you." },
    // Connectivity
    { q: 'Is wifi free?', a: 'Yes — free throughout the hotel. Network "PainDoreGuest", password "baguette2026".' },
    { q: 'Can I print at the hotel?', a: 'Yes — printing and scanning are free for guests. Bring a USB stick or email reception.' },
    { q: 'Is there a public computer for guests?', a: 'Yes — a guest computer with internet access is available in the lobby.' },
    { q: 'How fast is the wifi?', a: 'Around 200 Mbps down, fine for video calls and streaming.' },
    // Family & kids
    { q: 'Are children welcome?', a: 'Yes — children of all ages are warmly welcome. Cots, high chairs, and child amenities are all provided on request.' },
    { q: 'Is a high chair available at breakfast?', a: "Yes — just ask at the breakfast room and we'll bring one over." },
    { q: 'Can you arrange babysitting?', a: 'We work with vetted local babysitters. Please request at least 24 hours in advance.' },
    { q: 'Are there activities for children?', a: 'Reception can suggest kid-friendly Paris itineraries, and we keep colouring books and games in the lobby.' },
    { q: 'Are there family rooms?', a: 'Yes — several rooms accommodate two adults and two children comfortably. Please filter by family room when booking.' },
    // Pets
    { q: 'Are pets allowed?', a: 'Small dogs (under 10 kg) are welcome with a daily cleaning fee. Please request when booking.' },
    { q: 'Do you provide pet beds or bowls?', a: 'Yes — dog beds, bowls, and welcome treats are available on request, free of charge.' },
    { q: 'Where can I walk my dog?', a: 'The Jardin du Luxembourg is a 5-minute walk and is dog-friendly on a leash. Waste bags are at reception.' },
    // Parking
    { q: 'Is there parking at the hotel?', a: 'We have a small valet garage on site for 8 cars (€35/night). Reservation recommended.' },
    { q: 'Is there a public car park nearby?', a: 'Yes — Saint-Sulpice public car park is a 3-minute walk and open 24 hours. Reception can help with directions.' },
    { q: 'Do you have EV charging?', a: 'Our valet garage has one Type 2 charger. Please reserve when you book your parking spot.' },
    { q: 'Is there a height limit?', a: 'The valet garage has a 1.95 m clearance. Larger vehicles can use the public car park nearby.' },
    // Practical
    { q: 'Is laundry service available?', a: 'Yes — drop laundry at reception before 09:00 for same-day return. Pricing per item; list at reception.' },
    { q: 'Is dry cleaning available?', a: 'Yes — typically returned within 48 hours. Drop off at reception any time.' },
    { q: 'Can I borrow an iron and ironing board?', a: 'Of course — both available from reception, free of charge.' },
    { q: 'Is there a hairdryer in the room?', a: 'Yes — every room has a hairdryer in the bathroom.' },
    { q: 'What plug adapter do I need?', a: 'France uses Type E (European 2-pin with grounding) at 230V. Adapters are available at reception.' },
    { q: 'Where can I exchange currency?', a: "A currency exchange is on Rue de Rennes, 5 minutes' walk. Reception can advise on best rates and ATMs." },
    { q: 'Where is the nearest ATM?', a: 'An ATM is just outside the hotel on the boulevard. Reception can point you to others nearby.' },
    { q: 'Can my shoes be shined?', a: "Yes — leave them outside your door before 22:00 and they'll be ready by morning. Free service." },
    // Accessibility
    { q: 'Is the hotel wheelchair accessible?', a: 'The lobby and dining room are step-free. Two ground-floor rooms have adapted bathrooms. Please request when booking.' },
    { q: 'Is there an elevator?', a: 'Yes — our small elevator serves all five floors.' },
    { q: 'Are accessible bathrooms available?', a: 'Two of our ground-floor rooms have adapted bathrooms with grab rails and roll-in showers.' },
    // Safety & lost-and-found
    { q: 'Is there a safe in the room?', a: 'Yes — every room has a small in-room safe, large enough for a laptop and documents.' },
    { q: 'I left something in my room — what do I do?', a: 'Please call or email reception (lostandfound@lepaindore.example). We hold items for 30 days and can post on request.' },
    { q: 'Where is the nearest pharmacy or doctor?', a: 'A 24-hour pharmacy is on Boulevard Saint-Germain (3 minutes). For emergencies dial 15 (SAMU) or 112; reception can help.' },
    // Billing & policies
    { q: "What's the cancellation policy?", a: 'Free cancellation up to 7 days before arrival on most rates. Within 7 days, the first night is charged. Confirm in your booking email.' },
    { q: 'Do you require a deposit?', a: 'A pre-authorisation is taken on your card at booking; full payment is settled at check-out unless prepaid.' },
    { q: 'Which payment methods do you accept?', a: 'Visa, MasterCard, Amex, contactless, Apple/Google Pay, and cash (Euro).' },
    { q: 'Can I get an itemised invoice with my company name or VAT?', a: "Yes — please ask at check-out with the company details and we'll issue a proper invoice." },
    { q: 'Is there a Paris city tax?', a: 'Yes — a small daily taxe de séjour per adult is added to your bill at check-out. Current rate is set by the Paris council.' },
  ]

  const faqs = [
    ...adalinosFaqs.map((f, i) => ({ id: `F${String(i + 1).padStart(3, '0')}`, hotelId: 'H001', position: i, question: f.q, answer: f.a })),
    ...lepaindoreFaqs.map((f, i) => ({ id: `F${String(i + 1 + adalinosFaqs.length).padStart(3, '0')}`, hotelId: 'H003', position: i, question: f.q, answer: f.a })),
  ]
  for (const f of faqs) {
    await prisma.faq.upsert({ where: { id: f.id }, update: {}, create: f })
  }
  console.log(`  ✓ ${faqs.length} FAQs (${adalinosFaqs.length} ${adam.slug} + ${lepaindoreFaqs.length} ${jon.slug})`)

  console.log('Seed complete.')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
