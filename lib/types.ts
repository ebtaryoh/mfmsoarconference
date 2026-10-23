export type AttendeeRole = 
  | 'Youth Pastor / Minister'
  | 'Worker'
  | 'Campus Fellowship Leader'
  | 'Young Person'
  | 'Volunteer / Usher'

export type AttendeeCategory = 
  | 'Delegate'
  | 'Campus Leader'
  | 'Youth Pastor'
  | 'Choir / Creative'
  | 'Usher / Protocol'

export interface Attendee {
  id: string
  reference: string
  fullName: string
  email: string
  phone: string
  role: AttendeeRole
  category: AttendeeCategory
  unitOrCampus: string
  stateOrRegion: string
  registeredAt: string
  checkInStatus: 'not_checked_in' | 'checked_in'
  checkedInAt?: string
  checkedInBy?: string
  gate?: string
  dietaryOrNotes?: string
}

export interface ConferenceSession {
  id: string
  day: number
  date: string // e.g., 'Thursday, 10 Dec 2026'
  time: string // e.g., '09:00 AM - 11:30 AM'
  startTime: string
  endTime: string
  title: string
  category: 'Plenary' | 'Worship & Encounter' | 'Leadership Track' | 'Campus Forum' | 'Workshops'
  venue: string // e.g., 'Main Youth Auditorium, Prayer City'
  description: string
  ministers?: string[]
  isHighlight?: boolean
}

export interface OrganogramNode {
  id: string
  name: string
  role: string
  division: 'Executive' | 'Directorate' | 'Planning Committee' | 'Campus Network' | 'Operations & Protocol'
  level: 1 | 2 | 3 | 4 | 5
  parentId?: string
  image?: string
  bio: string
  responsibilities: string[]
  contact?: string
}

export interface MerchandiseProduct {
  id: string
  slug: string
  name: string
  category: 'Apparel' | 'Headwear' | 'Accessories' | 'Stationery'
  price: number // in NGN
  currency: string
  description: string
  features: string[]
  sizes?: string[]
  colors?: { name: string; hex: string }[]
  images: string[]
  inStock: boolean
  stockCount: number
  preOrderDeadline: string
  pickupLocation: string
}

export interface OrderItem {
  productId: string
  productName: string
  variantColor?: string
  variantSize?: string
  quantity: number
  unitPrice: number
}

export interface MerchandiseOrder {
  id: string
  orderReference: string
  attendeeReference?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  totalAmount: number
  currency: string
  orderDate: string
  paymentStatus: 'Paid Online' | 'Pay at Collection' | 'Complimentary'
  collectionStatus: 'pending' | 'collected'
  collectedAt?: string
  collectedBy?: string
  pickupCode: string
}

export interface ConferenceAnnouncement {
  id: string
  title: string
  content: string
  type: 'urgent' | 'info' | 'schedule' | 'transport' | 'merchandise'
  targetAudience: 'All Attendees' | 'Campus Leaders' | 'Youth Pastors' | 'Volunteers & Ushers'
  publishedAt: string
  author: string
  isActive: boolean
  isPinned?: boolean
}

export interface EventBlueprint {
  id: string
  name: string
  theme: string
  dates: string
  venue: string
  description: string
  estimatedAttendance: number
  ticketTypes: string[]
  tracks: string[]
  departments: string[]
  createdAt: string
  lastUsedAt: string
}
