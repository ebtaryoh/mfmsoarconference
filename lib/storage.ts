'use client'

import { 
  Attendee, 
  MerchandiseOrder, 
  ConferenceAnnouncement, 
  EventBlueprint 
} from './types'
import { 
  SEED_ATTENDEES, 
  SEED_ANNOUNCEMENTS, 
  SEED_BLUEPRINTS 
} from './conference-data'

const ATTENDEES_KEY = 'soar_2026_attendees'
const ORDERS_KEY = 'soar_2026_orders'
const ANNOUNCEMENTS_KEY = 'soar_2026_announcements'
const BLUEPRINTS_KEY = 'soar_2026_blueprints'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function generateRegistrationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const randPart1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  const randPart2 = Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `SOAR-2026-${randPart1}-${randPart2}`
}

export function generatePickupCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `VOUCH-SOAR-${rand}`
}

// ---------------- ATTENDEES ----------------
export function getAttendees(): Attendee[] {
  if (!isBrowser()) return SEED_ATTENDEES
  try {
    const data = localStorage.getItem(ATTENDEES_KEY)
    if (!data) {
      localStorage.setItem(ATTENDEES_KEY, JSON.stringify(SEED_ATTENDEES))
      return SEED_ATTENDEES
    }
    return JSON.parse(data)
  } catch (err) {
    console.error('Failed to read attendees from localStorage', err)
    return SEED_ATTENDEES
  }
}

export function getAttendeeByReference(refOrEmail: string): Attendee | undefined {
  const attendees = getAttendees()
  const needle = refOrEmail.trim().toLowerCase()
  return attendees.find(a => 
    a.reference.toLowerCase() === needle ||
    a.email.toLowerCase() === needle ||
    a.phone.replace(/[^0-9]/g, '') === needle.replace(/[^0-9]/g, '')
  )
}

export function saveAttendee(newAttendee: Omit<Attendee, 'id' | 'reference' | 'registeredAt' | 'checkInStatus'> & Partial<Attendee>): Attendee {
  const attendees = getAttendees()
  const reference = newAttendee.reference || generateRegistrationCode()
  const fullAttendee: Attendee = {
    id: `att-${Date.now()}`,
    reference,
    fullName: newAttendee.fullName,
    email: newAttendee.email,
    phone: newAttendee.phone,
    role: newAttendee.role,
    category: newAttendee.category || 'Delegate',
    unitOrCampus: newAttendee.unitOrCampus,
    stateOrRegion: newAttendee.stateOrRegion,
    registeredAt: new Date().toISOString(),
    checkInStatus: 'not_checked_in',
    dietaryOrNotes: newAttendee.dietaryOrNotes
  }

  const updated = [fullAttendee, ...attendees]
  if (isBrowser()) {
    localStorage.setItem(ATTENDEES_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('soar_attendees_updated'))
  }
  return fullAttendee
}

export function checkInAttendee(reference: string, gate = 'Gate 1 (Main Concourse)', usher = 'Usher Protocol Station'): { success: boolean; message: string; attendee?: Attendee } {
  const attendees = getAttendees()
  const needle = reference.trim().toUpperCase()
  const index = attendees.findIndex(a => a.reference.toUpperCase() === needle)

  if (index === -1) {
    return { success: false, message: 'Invalid ticket reference. Attendee not found in registry.' }
  }

  const attendee = attendees[index]
  if (attendee.checkInStatus === 'checked_in') {
    return { 
      success: false, 
      message: `Already checked in at ${new Date(attendee.checkedInAt || '').toLocaleTimeString()} (${attendee.gate || 'Gate'})`,
      attendee 
    }
  }

  attendee.checkInStatus = 'checked_in'
  attendee.checkedInAt = new Date().toISOString()
  attendee.checkedInBy = usher
  attendee.gate = gate

  attendees[index] = attendee
  if (isBrowser()) {
    localStorage.setItem(ATTENDEES_KEY, JSON.stringify(attendees))
    window.dispatchEvent(new Event('soar_attendees_updated'))
  }

  return { success: true, message: `Access granted! Welcome, ${attendee.fullName}.`, attendee }
}

// ---------------- ORDERS ----------------
const SEED_ORDERS: MerchandiseOrder[] = [
  {
    id: 'ord-01',
    orderReference: 'ORD-SOAR-7712',
    attendeeReference: 'SOAR-2026-7842-AX',
    customerName: 'Emmanuel Adeyemi',
    customerEmail: 'emmanuel.adeyemi@mfmyouth.org',
    customerPhone: '+234 803 234 5678',
    items: [
      {
        productId: 'prod-tee-01',
        productName: 'SOAR 2026 Signature Oversized Tee (Midnight Teal - L)',
        variantColor: 'Midnight Deep Teal',
        variantSize: 'L',
        quantity: 1,
        unitPrice: 8500
      },
      {
        productId: 'prod-cap-02',
        productName: 'SOAR Metallic Eagle Cap (Teal & Gold)',
        variantColor: 'Midnight Teal & Gold',
        variantSize: 'One Size',
        quantity: 1,
        unitPrice: 5500
      }
    ],
    totalAmount: 14000,
    currency: 'NGN',
    orderDate: '2026-10-19T14:30:00Z',
    paymentStatus: 'Paid Online',
    collectionStatus: 'collected',
    collectedAt: '2026-10-22T10:15:00Z',
    collectedBy: 'Merch Booth Officer 2',
    pickupCode: 'VOUCH-SOAR-948123'
  },
  {
    id: 'ord-02',
    orderReference: 'ORD-SOAR-9014',
    attendeeReference: 'SOAR-2026-9041-KB',
    customerName: 'Blessing Chidinma Okonkwo',
    customerEmail: 'blessing.okonkwo@gmail.com',
    customerPhone: '+234 812 345 6789',
    items: [
      {
        productId: 'prod-hoodie-03',
        productName: 'SOAR 2026 Commemorative Fleece Hoodie (Deep Forest - M)',
        variantColor: 'Deep Forest Teal',
        variantSize: 'M',
        quantity: 1,
        unitPrice: 18000
      }
    ],
    totalAmount: 18000,
    currency: 'NGN',
    orderDate: '2026-10-21T09:20:00Z',
    paymentStatus: 'Paid Online',
    collectionStatus: 'pending',
    pickupCode: 'VOUCH-SOAR-339182'
  }
]

export function getOrders(): MerchandiseOrder[] {
  if (!isBrowser()) return SEED_ORDERS
  try {
    const data = localStorage.getItem(ORDERS_KEY)
    if (!data) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(SEED_ORDERS))
      return SEED_ORDERS
    }
    return JSON.parse(data)
  } catch {
    return SEED_ORDERS
  }
}

export function saveOrder(order: Omit<MerchandiseOrder, 'id' | 'orderReference' | 'orderDate' | 'collectionStatus' | 'pickupCode'> & { orderReference?: string }): MerchandiseOrder {
  const orders = getOrders()
  const orderId = `ord-${Date.now()}`
  const orderRef = order.orderReference || `ORD-SOAR-${Math.floor(1000 + Math.random() * 9000)}`
  const pickupCode = generatePickupCode()

  const fullOrder: MerchandiseOrder = {
    ...order,
    id: orderId,
    orderReference: orderRef,
    orderDate: new Date().toISOString(),
    collectionStatus: 'pending',
    pickupCode
  }

  const updated = [fullOrder, ...orders]
  if (isBrowser()) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('soar_orders_updated'))
  }
  return fullOrder
}

export function collectOrder(pickupCodeOrRef: string, officer = 'Merch Desk Officer'): { success: boolean; message: string; order?: MerchandiseOrder } {
  const orders = getOrders()
  const needle = pickupCodeOrRef.trim().toUpperCase()
  const index = orders.findIndex(o => 
    o.pickupCode.toUpperCase() === needle || 
    o.orderReference.toUpperCase() === needle
  )

  if (index === -1) {
    return { success: false, message: 'Pickup voucher not found. Please verify the voucher code.' }
  }

  const order = orders[index]
  if (order.collectionStatus === 'collected') {
    return { 
      success: false, 
      message: `Duplicate pickup attempt! Order was already collected on ${new Date(order.collectedAt || '').toLocaleString()}`,
      order 
    }
  }

  order.collectionStatus = 'collected'
  order.collectedAt = new Date().toISOString()
  order.collectedBy = officer

  orders[index] = order
  if (isBrowser()) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
    window.dispatchEvent(new Event('soar_orders_updated'))
  }

  return { success: true, message: `Voucher verified! Release ${order.items.length} items to ${order.customerName}.`, order }
}

// ---------------- ANNOUNCEMENTS ----------------
export function getAnnouncements(): ConferenceAnnouncement[] {
  if (!isBrowser()) return SEED_ANNOUNCEMENTS
  try {
    const data = localStorage.getItem(ANNOUNCEMENTS_KEY)
    if (!data) {
      localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(SEED_ANNOUNCEMENTS))
      return SEED_ANNOUNCEMENTS
    }
    return JSON.parse(data)
  } catch {
    return SEED_ANNOUNCEMENTS
  }
}

export function saveAnnouncement(ann: Omit<ConferenceAnnouncement, 'id' | 'publishedAt'>): ConferenceAnnouncement {
  const list = getAnnouncements()
  const newAnn: ConferenceAnnouncement = {
    ...ann,
    id: `ann-${Date.now()}`,
    publishedAt: new Date().toISOString()
  }
  const updated = [newAnn, ...list]
  if (isBrowser()) {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('soar_announcements_updated'))
  }
  return newAnn
}

// ---------------- BLUEPRINTS ----------------
export function getBlueprints(): EventBlueprint[] {
  if (!isBrowser()) return SEED_BLUEPRINTS
  try {
    const data = localStorage.getItem(BLUEPRINTS_KEY)
    if (!data) {
      localStorage.setItem(BLUEPRINTS_KEY, JSON.stringify(SEED_BLUEPRINTS))
      return SEED_BLUEPRINTS
    }
    return JSON.parse(data)
  } catch {
    return SEED_BLUEPRINTS
  }
}

export function saveBlueprint(bp: Omit<EventBlueprint, 'id' | 'createdAt' | 'lastUsedAt'>): EventBlueprint {
  const blueprints = getBlueprints()
  const newBp: EventBlueprint = {
    ...bp,
    id: `bp-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    lastUsedAt: new Date().toISOString().split('T')[0]
  }
  const updated = [newBp, ...blueprints]
  if (isBrowser()) {
    localStorage.setItem(BLUEPRINTS_KEY, JSON.stringify(updated))
  }
  return newBp
}
