import { 
  Attendee, 
  ConferenceSession, 
  OrganogramNode, 
  MerchandiseProduct, 
  ConferenceAnnouncement,
  EventBlueprint 
} from './types'

export const CONFERENCE_INFO = {
  name: 'SOAR 2026',
  theme: 'Higher Together',
  shortTheme: 'Ascend. Unite. Impact.',
  organization: 'Mountain of Fire and Miracles Ministries (MFM) Youth Ministry',
  dates: '10–13 December 2026',
  startDate: '2026-12-10T09:00:00+01:00',
  endDate: '2026-12-13T17:00:00+01:00',
  venue: 'MFM Prayer City Multipurpose Hall',
  venueDetail: 'Multipurpose Hall, MFM Prayer City, KM 12 Lagos–Ibadan Expressway, Ogun State, Nigeria',
  dailySessions: '9:00 AM – 5:00 PM Daily',
  expectedCapacity: 15000,
  registeredCount: 8420,
  checkedInCount: 5190,
  registrationStatus: 'open' as const,
  heroArtwork: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-10-21%20at%2010.47.56%20AM-OxFTKqdOrXWmsFt5FKhNvSxFAfLiLx.jpeg',
  posterArtwork: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_2b9il82b9il82b9i.jfif-ZaYzTgyir2FxjHDzsnXPF2WNBhvuxK.jpeg',
  motionVideo: '/soar-2026-motion.mp4',
  mapsUrl: 'https://maps.google.com/?q=MFM+Prayer+City+Lagos+Ibadan+Expressway',
  supportEmail: 'soar2026@mfmyouth.org',
  supportPhone: '+234 803 000 7627',
  whatsappHelpDesk: 'https://wa.me/2348030007627?text=Hello%20SOAR%202026%20Team'
}

export const EDITIONS_ARCHIVE = [
  {
    year: '2023',
    theme: 'First Ascent',
    dates: 'Dec 2023',
    highlight: 'The inaugural national convocation laying spiritual and structural foundations for the youth awakening.',
    delegates: '4,200 Delegates',
    testimonies: 148,
    galleryCount: 24,
    status: 'archived',
    quote: '"A sacred altar was built, inspiring hundreds of campus chapters across the continent."'
  },
  {
    year: '2024',
    theme: 'Gathered Higher',
    dates: 'Dec 2024',
    highlight: 'Expanding the youth leadership paradigm with focused masterclasses on kingdom governance and campus revival.',
    delegates: '6,800 Delegates',
    testimonies: 280,
    galleryCount: 42,
    status: 'archived',
    quote: '"The power of unified prayer broke limitations for youth fellowships in tertiary institutions."'
  },
  {
    year: '2025',
    theme: 'The Movement Grows',
    dates: 'Dec 2025',
    highlight: 'Over 8,000 ministers, campus presidents, and young pioneers convened with intensive mentoring streams.',
    delegates: '8,500 Delegates',
    testimonies: 410,
    galleryCount: 56,
    status: 'archived',
    quote: '"Generational commissioning that launched hundreds of tech, media, and mission initiatives."'
  },
  {
    year: '2026',
    theme: 'Higher Together',
    dates: '10–13 Dec 2026',
    highlight: 'The flagship four-day gathering. United in prayer, power, leadership excellence, and national impact.',
    delegates: '12,000+ Target',
    testimonies: 0,
    galleryCount: 16,
    status: 'live',
    quote: '"They that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles."'
  }
]

export const LEADERSHIP_ORGANOGRAM: OrganogramNode[] = [
  {
    id: 'l1-go',
    name: 'General Overseer & Spiritual Patronage',
    role: 'MFM Worldwide Spiritual Father & Patron',
    division: 'Executive',
    level: 1,
    bio: 'Providing visionary apostolic oversight, prayers, and prophetic guidance for the national youth awakening.',
    responsibilities: [
      'Apostolic oversight and spiritual covering',
      'Prophetic impartation and final day charge',
      'Guidance for global youth initiatives'
    ]
  },
  {
    id: 'l2-pastor',
    parentId: 'l1-go',
    name: 'National Youth Pastor & Directorate',
    role: 'Convener & National Youth Overseer',
    division: 'Directorate',
    level: 2,
    bio: 'Executive leader directing MFM Youth Ministries worldwide and convening the SOAR Conference ecosystem.',
    responsibilities: [
      'Conference vision casting and strategic direction',
      'Ministerial alignment across all youth regions',
      'Executive authorization of conference programs'
    ]
  },
  {
    id: 'l3-planning',
    parentId: 'l2-pastor',
    name: 'SOAR Central Planning Committee',
    role: 'Conference Director & Chief Operations Lead',
    division: 'Planning Committee',
    level: 3,
    bio: 'Inter-disciplinary committee managing overall execution, logistics, budget, technology, and scheduling.',
    responsibilities: [
      'Overall timeline and program coordination',
      'Departmental synergy and risk management',
      'Liaison with Prayer City management'
    ]
  },
  {
    id: 'l4-campus',
    parentId: 'l3-planning',
    name: 'Campus Fellowship Directorate',
    role: 'Director of Campus Fellowships & Tertiary Ministries',
    division: 'Campus Network',
    level: 4,
    bio: 'Oversees delegations from universities, polytechnics, and colleges across Nigeria and diaspora chapters.',
    responsibilities: [
      'Mobilization of campus presidents and executives',
      'Student hostel allocation and transit coordination',
      'Campus leadership breakout session structuring'
    ]
  },
  {
    id: 'l4-ict',
    parentId: 'l3-planning',
    name: 'Event Technology & Systems Division',
    role: 'Lead, Event Operating System & Gate Mesh',
    division: 'Planning Committee',
    level: 4,
    bio: 'Overseeing attendee credentials, registration portal, QR scanner turnstiles, and data integrity.',
    responsibilities: [
      'Turnstile scanner uptime and offline sync',
      'Attendee digital pass and wallet infrastructure',
      'Merchandise voucher reconciliation'
    ]
  },
  {
    id: 'l4-ushers',
    parentId: 'l3-planning',
    name: 'Operations, Protocol & Ushering Corps',
    role: 'Chief Protocol Officer & Ushering Director',
    division: 'Operations & Protocol',
    level: 4,
    bio: 'Supervising 250+ trained ushers across main auditoriums, gate turnstiles, and protocol passages.',
    responsibilities: [
      'Auditorium crowd management and seating protocol',
      'Gate verification and QR badge validation',
      'VIP and visiting ministers facilitation'
    ]
  },
  {
    id: 'l5-merch',
    parentId: 'l4-ict',
    name: 'Store & Merchandise Operations',
    role: 'Merchandise Desk Supervisor',
    division: 'Operations & Protocol',
    level: 5,
    bio: 'Managing conference apparel production, pre-order inventory, and the Prayer City collection booths.',
    responsibilities: [
      'Pre-order pack preparation and stock monitoring',
      'Pickup voucher scanning and duplicate prevention',
      'On-site store customer assistance'
    ]
  }
]

export const CONFERENCE_SCHEDULE: ConferenceSession[] = [
  // Day 1: Thursday, 10 Dec 2026
  {
    id: 'd1-s1',
    day: 1,
    date: 'Thursday, 10 Dec 2026',
    time: '09:00 AM – 11:30 AM',
    startTime: '09:00',
    endTime: '11:30',
    title: 'Delegation Arrival, Turnstile Accreditation & Check-in',
    category: 'Workshops',
    venue: 'Prayer City Main Gate & Youth Accreditation Plaza',
    description: 'Arrival of campus delegations, scanning of digital passes, collection of conference wristbands and pre-ordered merchandise kits.',
    isHighlight: false
  },
  {
    id: 'd1-s2',
    day: 1,
    date: 'Thursday, 10 Dec 2026',
    time: '12:00 PM – 02:30 PM',
    startTime: '12:00',
    endTime: '14:30',
    title: 'Opening Plenary: The Sound of Eagles Gathering',
    category: 'Plenary',
    venue: 'Main Youth Auditorium',
    description: 'Welcome address, opening charge by the National Youth Pastor, high-impact worship, and setting spiritual atmospheres.',
    ministers: ['National Youth Leadership', 'SOAR Mass Choir'],
    isHighlight: true
  },
  {
    id: 'd1-s3',
    day: 1,
    date: 'Thursday, 10 Dec 2026',
    time: '03:00 PM – 05:00 PM',
    startTime: '15:00',
    endTime: '17:00',
    title: 'Campus Presidents & Fellowship Leaders Forum (Track A)',
    category: 'Campus Forum',
    venue: 'Hall of Grace, Prayer City',
    description: 'Strategic strategy session for campus executives on kingdom dominance, academic distinction, and campus revival.',
    isHighlight: false
  },

  // Day 2: Friday, 11 Dec 2026
  {
    id: 'd2-s1',
    day: 2,
    date: 'Friday, 11 Dec 2026',
    time: '09:00 AM – 11:00 AM',
    startTime: '09:00',
    endTime: '11:00',
    title: 'Morning Glory: Deep Intimacy & Prophetic Intercession',
    category: 'Worship & Encounter',
    venue: 'Main Youth Auditorium',
    description: 'Two hours of unbroken intercession, prophetic prayers for youth in Africa, and spiritual warfare against generational stagnancy.',
    ministers: ['Prophetic Intercession Team'],
    isHighlight: true
  },
  {
    id: 'd2-s2',
    day: 2,
    date: 'Friday, 11 Dec 2026',
    time: '11:30 AM – 01:30 PM',
    startTime: '11:30',
    endTime: '13:30',
    title: 'Masterclass: Excellence in Ministry, Tech & Kingdom Finance',
    category: 'Leadership Track',
    venue: 'Exhibition Hall 2',
    description: 'Equipping youth workers and professionals to excel in creative industries, tech entrepreneurship, and sustainable ministry funding.',
    isHighlight: false
  },
  {
    id: 'd2-s3',
    day: 2,
    date: 'Friday, 11 Dec 2026',
    time: '02:30 PM – 05:00 PM',
    startTime: '14:30',
    endTime: '17:00',
    title: 'General Plenary: Breaking Limits & Mental Strongholds',
    category: 'Plenary',
    venue: 'Main Youth Auditorium',
    description: 'Anointed word session on breaking invisible ceilings, generational curses, and stepping into ordained authority.',
    ministers: ['Keynote Guest Speaker'],
    isHighlight: true
  },

  // Day 3: Saturday, 12 Dec 2026
  {
    id: 'd3-s1',
    day: 3,
    date: 'Saturday, 12 Dec 2026',
    time: '09:00 AM – 11:30 AM',
    startTime: '09:00',
    endTime: '11:30',
    title: 'Youth Pastors & Ministers Roundtable',
    category: 'Leadership Track',
    venue: 'Conference Center Hall B',
    description: 'Exclusive executive session addressing youth pastoral care, mental health, family balance, and leadership ethics.',
    isHighlight: false
  },
  {
    id: 'd3-s2',
    day: 3,
    date: 'Saturday, 12 Dec 2026',
    time: '12:00 PM – 02:30 PM',
    startTime: '12:00',
    endTime: '14:30',
    title: 'Worship Encounter: Wings Like Eagles',
    category: 'Worship & Encounter',
    venue: 'Main Youth Auditorium',
    description: 'Intense praise explosion, creative arts presentation, choreographies, and spontaneous worship warfare.',
    ministers: ['SOAR Creative Arts & Worship Collective'],
    isHighlight: true
  },
  {
    id: 'd3-s3',
    day: 3,
    date: 'Saturday, 12 Dec 2026',
    time: '03:00 PM – 05:00 PM',
    startTime: '15:00',
    endTime: '17:00',
    title: 'Commissioning & Apostolic Impartation Service',
    category: 'Plenary',
    venue: 'Main Youth Auditorium',
    description: 'Special apostolic laying on of hands, spiritual commissioning for campus ambassadors, and prophetic declarations.',
    ministers: ['General Overseer & Apostolic Council'],
    isHighlight: true
  },

  // Day 4: Sunday, 13 Dec 2026
  {
    id: 'd4-s1',
    day: 4,
    date: 'Sunday, 13 Dec 2026',
    time: '09:00 AM – 01:00 PM',
    startTime: '09:00',
    endTime: '13:00',
    title: 'Grand Thanksgiving & Celebration Service: Higher Together',
    category: 'Plenary',
    venue: 'Main Youth Auditorium & Prayer City Grounds',
    description: 'The climactic final gathering celebrating God\'s power over the 4 days, regional roll calls, and final benediction.',
    ministers: ['All Leadership & Mass Congregational Choir'],
    isHighlight: true
  },
  {
    id: 'd4-s2',
    day: 4,
    date: 'Sunday, 13 Dec 2026',
    time: '02:00 PM – 05:00 PM',
    startTime: '14:00',
    endTime: '17:00',
    title: 'Delegations Fellowship, Networking & Safe Departures',
    category: 'Workshops',
    venue: 'Prayer City Youth Concourse',
    description: 'Group photography, inter-campus networking, merchandise pickup completion, and organized regional transport departures.',
    isHighlight: false
  }
]

export const MERCHANDISE_PRODUCTS: MerchandiseProduct[] = [
  {
    id: 'prod-tee-01',
    slug: 'soar-2026-official-conference-tee',
    name: 'SOAR 2026 Official Conference Tee',
    category: 'Apparel',
    price: 8500,
    currency: 'NGN',
    description: 'Official conference tee worn by youth pastors and delegates. 280 GSM premium heavyweight combed cotton featuring the high-density metallic gold SOAR eagle emblem and MFM Youth Ministry chest badge.',
    features: [
      '280 GSM heavyweight combed luxury cotton',
      'High-density metallic gold & flame screenprint',
      'Relaxed Gen-Z drop-shoulder & classic silhouette',
      'Woven MFM Youth Ministry authentic hem label'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', 'Oversized Boxy Fit'],
    colors: [
      { name: 'Midnight Deep Navy', hex: '#0c1b33' },
      { name: 'Pitch Black', hex: '#111827' },
      { name: 'Warm Ivory', hex: '#f4efe4' },
      { name: 'Forest Teal', hex: '#062d31' }
    ],
    images: [
      '/merch/soar-merch-1.jpg'
    ],
    inStock: true,
    stockCount: 650,
    preOrderDeadline: '05 December 2026',
    pickupLocation: 'Prayer City Youth Pavilion, Booth 4'
  },
  {
    id: 'prod-cap-02',
    slug: 'soar-2026-3d-embroidered-structured-cap',
    name: 'SOAR 2026 3D Embroidered Structured Cap',
    category: 'Headwear',
    price: 6000,
    currency: 'NGN',
    description: 'Authentic 6-panel structured twill cap with 3D high-density metallic gold embroidery of the soaring eagle, flame crest, and curved visor with brass closure.',
    features: [
      '3D puff metallic gold thread embroidery',
      'Breathable reinforced crown structure',
      'Curved peak visor with contrast underbrim',
      'Antique brass adjustable buckle closure'
    ],
    sizes: ['One Size Fits All (Adjustable)'],
    colors: [
      { name: 'Deep Navy Blue', hex: '#0c1b33' },
      { name: 'Obsidian Black', hex: '#111827' },
      { name: 'Royal Teal', hex: '#062d31' },
      { name: 'Crimson Flame', hex: '#8d210f' }
    ],
    images: [
      '/merch/soar-merch-2.jpg'
    ],
    inStock: true,
    stockCount: 450,
    preOrderDeadline: '05 December 2026',
    pickupLocation: 'Prayer City Youth Pavilion, Booth 4'
  },
  {
    id: 'prod-hoodie-03',
    slug: 'soar-2026-commemorative-fleece-hoodie',
    name: 'SOAR 2026 Gen-Z Heavyweight Fleece Hoodie',
    category: 'Apparel',
    price: 18500,
    currency: 'NGN',
    description: 'Ultra-soft 420 GSM brushed organic fleece hoodie tailored for chilly Prayer City night vigils. Double-lined hood, embroidered gold chest crest, and kangaroo pouch pocket.',
    features: [
      '420 GSM ultra-heavyweight brushed fleece',
      'Oversized Gen-Z streetwear drop-shoulder cut',
      'Double-walled hood with custom metal aglets',
      'Embroidered gold eagle emblem on left sleeve'
    ],
    sizes: ['M', 'L', 'XL', '2XL', '3XL (Drop-Shoulder Oversized)'],
    colors: [
      { name: 'Midnight Deep Navy', hex: '#0c1b33' },
      { name: 'Deep Forest Teal', hex: '#041d24' },
      { name: 'Charcoal Night', hex: '#1e293b' }
    ],
    images: [
      '/merch/soar-merch-1.jpg'
    ],
    inStock: true,
    stockCount: 220,
    preOrderDeadline: '01 December 2026',
    pickupLocation: 'Prayer City Youth Pavilion, Booth 4'
  },
  {
    id: 'prod-journal-04',
    slug: 'higher-together-ministry-journal-pen',
    name: 'Higher Together Debossed Leather Journal & Pen Set',
    category: 'Stationery',
    price: 6000,
    currency: 'NGN',
    description: 'Debossed vegan leather notebook with 200 lined gold-gilded pages, conference agenda maps, and a weighted matte gold executive ballpoint pen.',
    features: [
      'Hardcover vegan leather with debossed gold foil',
      '200 acid-free 100 GSM ivory pages',
      'Double ribbon bookmarks and elastic closure',
      'Includes refillable matte gold brass pen'
    ],
    sizes: ['A5 (148 x 210 mm)'],
    colors: [
      { name: 'Midnight Navy & Gold', hex: '#0c1b33' },
      { name: 'Royal Teal & Gold', hex: '#062d31' }
    ],
    images: [
      '/merch/soar-merch-2.jpg'
    ],
    inStock: true,
    stockCount: 500,
    preOrderDeadline: '08 December 2026',
    pickupLocation: 'Prayer City Youth Pavilion, Booth 4'
  },
  {
    id: 'prod-wristband-05',
    slug: 'soar-2026-luminous-glow-wristband',
    name: 'SOAR 2026 Luminous Glow-In-The-Dark Wristband',
    category: 'Accessories',
    price: 1500,
    currency: 'NGN',
    description: 'High-grade phosphorescent hypoallergenic silicone wristband debossed with the SOAR 2026 emblem and Isaiah 40:31 theme scripture.',
    features: [
      'Phosphorescent glow-in-the-dark compound',
      'Debossed gold metallic color-filled lettering',
      'Hypoallergenic flexible waterproof silicone',
      'Comfort-fit youth profile'
    ],
    sizes: ['Standard Youth Fit'],
    colors: [
      { name: 'Luminous Glow Gold', hex: '#ffd66a' },
      { name: 'Electric Teal', hex: '#062d31' }
    ],
    images: [
      '/merch/soar-merch-2.jpg'
    ],
    inStock: true,
    stockCount: 1200,
    preOrderDeadline: '10 December 2026',
    pickupLocation: 'Prayer City Youth Pavilion, Booth 4'
  }
]

export const FAQS = [
  {
    category: 'Registration & Tickets',
    items: [
      {
        q: 'Is registration required to attend SOAR 2026?',
        a: 'Yes. Every attendee, delegate, youth pastor, and worker must register online to obtain their personalized digital pass and scannable turnstile QR code. This ensures seamless gate clearance, seating allocation, and security at MFM Prayer City.'
      },
      {
        q: 'Is registration free or paid?',
        a: 'Registration for SOAR 2026 is completely free! Conference access, session materials, and general entry require zero registration fees. Paid items in the store are strictly optional commemorative merchandise.'
      },
      {
        q: 'Can I register on behalf of my campus fellowship or youth church group?',
        a: 'Yes. Fellowship leaders can submit registrations for their key delegates. We recommend that each attendee provides their own email and phone number so they can receive their personal pass link directly via WhatsApp.'
      }
    ]
  },
  {
    category: 'Dates, Venue & Access',
    items: [
      {
        q: 'Where is the conference venue?',
        a: 'The conference holds live at MFM Prayer City, KM 12 Lagos–Ibadan Expressway, Ogun State, Nigeria. Main auditoriums and breakout halls are clearly signposted with dedicated usher guides.'
      },
      {
        q: 'What are the daily hours and program schedule?',
        a: 'The conference runs across 4 days from Thursday 10 December to Sunday 13 December 2026. Daily sessions begin promptly at 9:00 AM and conclude at 5:00 PM.'
      },
      {
        q: 'Is accommodation provided for delegates from outside Lagos/Ogun state?',
        a: 'Hostel and dormitory accommodations inside Prayer City are arranged through campus leaders and youth regional coordinators. Indicate your accommodation request during registration.'
      }
    ]
  },
  {
    category: 'Check-in, QR Codes & Wallet',
    items: [
      {
        q: 'How does the digital QR pass work at the gate turnstiles?',
        a: 'Upon registration, you receive an instant digital ticket with a unique QR code. You can view it in your attendee wallet or download a high-res PNG badge to your phone gallery. At the gate, ushers will scan your QR code with turnstile scanners in under two seconds.'
      },
      {
        q: 'Will my ticket work if I do not have active internet connection at Prayer City?',
        a: 'Yes! You can download your ticket pass as a high-resolution PNG to your phone gallery or save it in your attendee wallet offline. The gate scanning mesh operates with synchronized local verification.'
      },
      {
        q: 'What if I misplace my ticket link or reference code?',
        a: 'You can quickly retrieve your pass at any time on the website by entering your registered email or phone number in the Attendee Hub lookup.'
      }
    ]
  },
  {
    category: 'Store & Merchandise Pre-orders',
    items: [
      {
        q: 'How do I pick up my pre-ordered merchandise?',
        a: 'When you pre-order merchandise from the SOAR Store, a unique Pickup Voucher with its own QR code is issued to your wallet. Present this voucher at the Prayer City Youth Pavilion (Booth 4) during the conference to receive your packaged items.'
      },
      {
        q: 'Can someone else collect my order for me?',
        a: 'Yes, provided they possess your official Order Reference and show the verified Pickup QR Voucher from your order screen.'
      }
    ]
  }
]

export const SEED_ANNOUNCEMENTS: ConferenceAnnouncement[] = [
  {
    id: 'ann-01',
    title: 'Prayer City Turnstile Accreditation Mesh Is Live',
    content: 'All delegates arriving between 08:00 AM and 11:00 AM should proceed through Gates 2 & 4 with their digital QR codes ready on their mobile screens for instant entry.',
    type: 'urgent',
    targetAudience: 'All Attendees',
    publishedAt: '2026-10-22T14:30:00Z',
    author: 'MFM Youth ICT & Protocol Directorate',
    isActive: true,
    isPinned: true
  },
  {
    id: 'ann-02',
    title: 'Inter-Campus Delegation Buses Schedule',
    content: 'Special regional bus shuttles have been designated from major tertiary institutions across South-West and South-South corridors. Check with your campus fellowship president for exact departure points.',
    type: 'transport',
    targetAudience: 'Campus Leaders',
    publishedAt: '2026-10-21T18:00:00Z',
    author: 'Campus Fellowship Logistics Desk',
    isActive: true,
    isPinned: false
  },
  {
    id: 'ann-03',
    title: 'Merchandise Pre-order Pack Preparation Underway',
    content: 'Delegates who pre-ordered the Signature Oversized Tee or Fleece Hoodie can collect their packages from Day 1 at Booth 4, Youth Pavilion.',
    type: 'merchandise',
    targetAudience: 'All Attendees',
    publishedAt: '2026-10-20T10:15:00Z',
    author: 'SOAR Store Management',
    isActive: true,
    isPinned: false
  }
]

export const SEED_ATTENDEES: Attendee[] = [
  {
    id: 'att-01',
    reference: 'SOAR-2026-7842-AX',
    fullName: 'Emmanuel Adeyemi',
    email: 'emmanuel.adeyemi@mfmyouth.org',
    phone: '+234 803 234 5678',
    role: 'Campus Fellowship Leader',
    category: 'Campus Leader',
    unitOrCampus: 'University of Lagos (UNILAG) Youth Fellowship',
    stateOrRegion: 'Lagos State',
    registeredAt: '2026-10-18T11:24:00Z',
    checkInStatus: 'checked_in',
    checkedInAt: '2026-10-22T08:42:00Z',
    checkedInBy: 'Usher Team Lead (Gate 2)',
    gate: 'Gate 2 (East Concourse)'
  },
  {
    id: 'att-02',
    reference: 'SOAR-2026-9041-KB',
    fullName: 'Blessing Chidinma Okonkwo',
    email: 'blessing.okonkwo@gmail.com',
    phone: '+234 812 345 6789',
    role: 'Worker',
    category: 'Choir / Creative',
    unitOrCampus: 'MFM Youth Church Headquarters, Yaba',
    stateOrRegion: 'Lagos State',
    registeredAt: '2026-10-19T14:10:00Z',
    checkInStatus: 'checked_in',
    checkedInAt: '2026-10-22T08:58:00Z',
    checkedInBy: 'Protocol Desk A',
    gate: 'Gate 1 (Main Entrance)'
  },
  {
    id: 'att-03',
    reference: 'SOAR-2026-3392-QP',
    fullName: 'Pastor Jeremiah O. Adeleke',
    email: 'jeremiah.adeleke@mfmyouth.org',
    phone: '+234 802 888 9911',
    role: 'Youth Pastor / Minister',
    category: 'Youth Pastor',
    unitOrCampus: 'MFM South-West Region 4 Youth Directorate',
    stateOrRegion: 'Oyo State',
    registeredAt: '2026-10-16T09:15:00Z',
    checkInStatus: 'checked_in',
    checkedInAt: '2026-10-22T09:12:00Z',
    checkedInBy: 'VIP Protocol Gate',
    gate: 'Gate 4 (VIP Auditorium)'
  },
  {
    id: 'att-04',
    reference: 'SOAR-2026-5519-TX',
    fullName: 'David Temitope Balogun',
    email: 'david.balogun@outlook.com',
    phone: '+234 705 123 4567',
    role: 'Young Person',
    category: 'Delegate',
    unitOrCampus: 'Obafemi Awolowo University (OAU) Chapter',
    stateOrRegion: 'Osun State',
    registeredAt: '2026-10-20T16:45:00Z',
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'att-05',
    reference: 'SOAR-2026-6623-RM',
    fullName: 'Grace Oluwaseun Fashola',
    email: 'grace.fashola@yahoo.com',
    phone: '+234 901 777 8822',
    role: 'Volunteer / Usher',
    category: 'Usher / Protocol',
    unitOrCampus: 'Prayer City Youth Technical Guild',
    stateOrRegion: 'Ogun State',
    registeredAt: '2026-10-15T12:00:00Z',
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'att-06',
    reference: 'SOAR-2026-8812-VL',
    fullName: 'Kelechi Samuel Nwosu',
    email: 'kelechi.nwosu@gmail.com',
    phone: '+234 814 900 1122',
    role: 'Young Person',
    category: 'Delegate',
    unitOrCampus: 'University of Ibadan (UI) Campus Fellowship',
    stateOrRegion: 'Oyo State',
    registeredAt: '2026-10-21T19:30:00Z',
    checkInStatus: 'not_checked_in'
  }
]

export const SEED_BLUEPRINTS: EventBlueprint[] = [
  {
    id: 'bp-soar-annual',
    name: 'SOAR National Annual Flagship (4-Day Standard)',
    theme: 'Higher Together (Full Ecosystem)',
    dates: '10–13 December 2026',
    venue: 'MFM Prayer City, KM 12 Lagos-Ibadan Expressway',
    description: 'Complete operational blueprint including turnstile accreditation, 4 tracks, multi-booth store, campus delegation logistics, and volunteer staffing.',
    estimatedAttendance: 15000,
    ticketTypes: ['Delegate Pass', 'Campus Leader Credential', 'Minister VIP Badge', 'Usher / Crew Pass'],
    tracks: ['Plenary', 'Campus Leaders Forum', 'Worship Encounter', 'Leadership Track', 'Workshops'],
    departments: ['Executive', 'Directorate', 'Planning Committee', 'Campus Network', 'Operations & Protocol'],
    createdAt: '2026-01-15',
    lastUsedAt: '2026-10-22'
  },
  {
    id: 'bp-campus-awakening',
    name: 'SOAR Campus Awakening Tour (2-Day Regional)',
    theme: 'Fire on Campus',
    dates: 'March / April 2027 (Proposed)',
    venue: 'Selected Zonal University Centers',
    description: 'Streamlined regional mobilization blueprint designed for tertiary institutions with fast mobile accreditation and youth evangelism tracks.',
    estimatedAttendance: 3500,
    ticketTypes: ['Student Pass', 'Campus Worker Credential'],
    tracks: ['Holy Ghost Rally', 'Academic & Career Masterclass'],
    departments: ['Zonal Campus Council', 'Local Protocol Team'],
    createdAt: '2026-05-10',
    lastUsedAt: '2026-08-20'
  },
  {
    id: 'bp-ministers-retreat',
    name: 'Youth Pastors & Ministers Leadership Retreat',
    theme: 'Watchmen on the Wall',
    dates: 'August 2027',
    venue: 'International Conference Center, Prayer City',
    description: 'High-level ministerial intensive with spiritual warfare immersion, pastoral counseling workshops, and leadership development.',
    estimatedAttendance: 1200,
    ticketTypes: ['Minister Delegate', 'Regional Overseer Pass'],
    tracks: ['Apostolic Impartation', 'Ministry Ethics & Governance'],
    departments: ['Directorate', 'Secretariat'],
    createdAt: '2026-03-01',
    lastUsedAt: '2026-08-14'
  }
]
