import { 
  pgTable, 
  text, 
  timestamp, 
  integer, 
  boolean, 
  jsonb, 
  uuid, 
  varchar, 
  index, 
  uniqueIndex 
} from 'drizzle-orm/pg-core'

// 1. ORGANIZATIONS & UNITS
export const organizations = pgTable('organizations', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: text('name').notNull(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const orgUnits = pgTable('org_units', {
  id: varchar('id', { length: 64 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 64 }).references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  type: varchar('type', { length: 32 }).notNull(), // 'campus_fellowship', 'youth_church', 'directorate', 'ushering_corps'
  stateOrRegion: varchar('state_or_region', { length: 64 }).notNull(),
  contactEmail: varchar('contact_email', { length: 128 }),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// 2. USERS, ROLES & PERMISSIONS
export const users = pgTable('users', {
  id: varchar('id', { length: 64 }).primaryKey(),
  email: varchar('email', { length: 191 }).notNull().unique(),
  fullName: text('fullName').notNull(),
  phoneNumber: varchar('phone_number', { length: 32 }),
  passwordHash: text('password_hash'),
  role: varchar('role', { length: 32 }).notNull().default('attendee'),
  // Roles: 'platform_admin', 'org_admin', 'conference_admin', 'registration_manager', 'check_in_usher', 'merchandise_manager', 'announcement_publisher', 'analyst', 'attendee'
  orgUnitId: varchar('org_unit_id', { length: 64 }).references(() => orgUnits.id),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// 3. EVENTS & REUSABLE BLUEPRINTS
export const events = pgTable('events', {
  id: varchar('id', { length: 64 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 64 }).references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  theme: text('theme').notNull(),
  year: integer('year').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  venueName: text('venue_name').notNull(),
  venueAddress: text('venue_address').notNull(),
  maxCapacity: integer('max_capacity').default(15000).notNull(),
  status: varchar('status', { length: 24 }).notNull().default('published'), // 'draft', 'published', 'active', 'archived'
  isArchived: boolean('is_archived').default(false).notNull(),
  settings: jsonb('settings').$type<{
    allowFreeRegistration: boolean
    requirePhoneVerification: boolean
    offlineManifestSecret?: string
    paystackPublicKey?: string
    supportEmail?: string
  }>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const eventBlueprints = pgTable('event_blueprints', {
  id: varchar('id', { length: 64 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 64 }).references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  sourceEventId: varchar('source_event_id', { length: 64 }),
  version: integer('version').default(1).notNull(),
  configuration: jsonb('configuration').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// 4. REGISTRATIONS & ATTENDEES
export const registrations = pgTable('registrations', {
  id: varchar('id', { length: 64 }).primaryKey(),
  eventId: varchar('event_id', { length: 64 }).references(() => events.id).notNull(),
  reference: varchar('reference', { length: 64 }).notNull().unique(), // e.g., 'SOAR-2026-XXXX-XX'
  attendeeName: text('attendee_name').notNull(),
  email: varchar('email', { length: 191 }).notNull(),
  phone: varchar('phone', { length: 32 }).notNull(),
  roleCategory: varchar('role_category', { length: 64 }).notNull(),
  unitOrCampus: text('unit_or_campus').notNull(),
  stateOrRegion: varchar('state_or_region', { length: 64 }).notNull(),
  accommodationRequested: boolean('accommodation_requested').default(false).notNull(),
  notes: text('notes'),
  status: varchar('status', { length: 24 }).notNull().default('confirmed'), // 'confirmed', 'cancelled', 'waitlisted'
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  registeredAt: timestamp('registered_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  index('reg_event_idx').on(table.eventId),
  index('reg_email_idx').on(table.email),
  index('reg_ref_idx').on(table.reference)
])

// 5. TICKETS & CHECK-INS (SEPARATE DOMAIN CONCEPTS)
export const tickets = pgTable('tickets', {
  id: varchar('id', { length: 64 }).primaryKey(),
  eventId: varchar('event_id', { length: 64 }).references(() => events.id).notNull(),
  registrationId: varchar('registration_id', { length: 64 }).references(() => registrations.id).notNull(),
  ticketCode: varchar('ticket_code', { length: 64 }).notNull().unique(), // Cryptographic token
  securityHash: varchar('security_hash', { length: 128 }).notNull(), // HMAC signature
  tier: varchar('tier', { length: 32 }).notNull().default('general_admission'),
  status: varchar('status', { length: 24 }).notNull().default('active'), // 'active', 'revoked', 'used', 'expired'
  issuedAt: timestamp('issued_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at')
}, (table) => [
  index('tkt_event_idx').on(table.eventId),
  index('tkt_code_idx').on(table.ticketCode)
])

export const ticketCheckIns = pgTable('ticket_check_ins', {
  id: varchar('id', { length: 64 }).primaryKey(),
  ticketId: varchar('ticket_id', { length: 64 }).references(() => tickets.id).notNull().unique(), // Strictly 1 valid check-in
  eventId: varchar('event_id', { length: 64 }).references(() => events.id).notNull(),
  scannerDeviceId: varchar('scanner_device_id', { length: 64 }),
  scannedByUserId: varchar('scanned_by_user_id', { length: 64 }).references(() => users.id),
  gateName: varchar('gate_name', { length: 64 }).notNull().default('Gate 1'),
  checkInMethod: varchar('check_in_method', { length: 32 }).notNull().default('qr_scanner'), // 'qr_scanner', 'turnstile_kiosk', 'manual_override', 'offline_sync'
  operationId: varchar('operation_id', { length: 64 }).notNull().unique(), // Idempotency key
  checkedInAt: timestamp('checked_in_at').defaultNow().notNull(),
  isOfflineSync: boolean('is_offline_sync').default(false).notNull()
}, (table) => [
  index('chk_event_idx').on(table.eventId),
  index('chk_tkt_idx').on(table.ticketId)
])

// 6. SCANNER DEVICES & OFFLINE MANIFEST BATCHES
export const scannerDevices = pgTable('scanner_devices', {
  id: varchar('id', { length: 64 }).primaryKey(),
  deviceId: varchar('device_id', { length: 128 }).notNull().unique(),
  label: text('label').notNull(),
  gateAssigned: varchar('gate_assigned', { length: 64 }),
  lastSyncAt: timestamp('last_sync_at'),
  manifestVersion: integer('manifest_version').default(0),
  isActive: boolean('is_active').default(true).notNull()
})

export const syncBatches = pgTable('sync_batches', {
  id: varchar('id', { length: 64 }).primaryKey(),
  scannerDeviceId: varchar('scanner_device_id', { length: 64 }).references(() => scannerDevices.id),
  batchSize: integer('batch_size').notNull(),
  successfulCount: integer('successful_count').notNull(),
  rejectedCount: integer('rejected_count').notNull(),
  clientTimestamp: timestamp('client_timestamp').notNull(),
  syncedAt: timestamp('synced_at').defaultNow().notNull()
})

// 7. MERCHANDISE PRODUCTS, VARIANTS & INVENTORY
export const merchandiseProducts = pgTable('merchandise_products', {
  id: varchar('id', { length: 64 }).primaryKey(),
  eventId: varchar('event_id', { length: 64 }).references(() => events.id).notNull(),
  name: text('name').notNull(),
  slug: varchar('slug', { length: 128 }).notNull(),
  category: varchar('category', { length: 32 }).notNull(),
  basePrice: integer('base_price').notNull(), // NGN in smallest units or whole Naira
  currency: varchar('currency', { length: 8 }).notNull().default('NGN'),
  description: text('description').notNull(),
  images: jsonb('images').$type<string[]>().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const productVariants = pgTable('product_variants', {
  id: varchar('id', { length: 64 }).primaryKey(),
  productId: varchar('product_id', { length: 64 }).references(() => merchandiseProducts.id).notNull(),
  size: varchar('size', { length: 16 }),
  colorName: varchar('color_name', { length: 32 }),
  colorHex: varchar('color_hex', { length: 16 }),
  sku: varchar('sku', { length: 64 }).notNull().unique(),
  inventoryCount: integer('inventory_count').notNull().default(0),
  reservedCount: integer('reserved_count').notNull().default(0),
  priceOffset: integer('price_offset').default(0).notNull()
})

// 8. ORDERS, PAYMENTS & VOUCHERS
export const orders = pgTable('orders', {
  id: varchar('id', { length: 64 }).primaryKey(),
  eventId: varchar('event_id', { length: 64 }).references(() => events.id).notNull(),
  orderReference: varchar('order_reference', { length: 64 }).notNull().unique(),
  registrationId: varchar('registration_id', { length: 64 }).references(() => registrations.id),
  customerName: text('customer_name').notNull(),
  customerEmail: varchar('customer_email', { length: 191 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 32 }).notNull(),
  totalAmount: integer('total_amount').notNull(),
  currency: varchar('currency', { length: 8 }).notNull().default('NGN'),
  paymentStatus: varchar('payment_status', { length: 24 }).notNull().default('pending'), // 'pending', 'verified', 'failed', 'refunded'
  collectionStatus: varchar('collection_status', { length: 24 }).notNull().default('pending'), // 'pending', 'partial', 'collected'
  paymentProvider: varchar('payment_provider', { length: 32 }).default('paystack'),
  paymentReference: varchar('payment_reference', { length: 128 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  index('ord_event_idx').on(table.eventId),
  index('ord_ref_idx').on(table.orderReference)
])

export const orderItems = pgTable('order_items', {
  id: varchar('id', { length: 64 }).primaryKey(),
  orderId: varchar('order_id', { length: 64 }).references(() => orders.id).notNull(),
  variantId: varchar('variant_id', { length: 64 }).references(() => productVariants.id).notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price').notNull(),
  subtotal: integer('subtotal').notNull()
})

export const pickupVouchers = pgTable('pickup_vouchers', {
  id: varchar('id', { length: 64 }).primaryKey(),
  orderId: varchar('order_id', { length: 64 }).references(() => orders.id).notNull().unique(),
  voucherCode: varchar('voucher_code', { length: 64 }).notNull().unique(), // Cryptographic voucher QR token
  securityHash: varchar('security_hash', { length: 128 }).notNull(),
  status: varchar('status', { length: 24 }).notNull().default('active'), // 'active', 'redeemed', 'cancelled'
  boothAssigned: varchar('booth_assigned', { length: 64 }).default('Booth 4 (Youth Pavilion)'),
  collectedAt: timestamp('collected_at'),
  collectedByUserId: varchar('collected_by_user_id', { length: 64 }).references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// 9. SCHEDULES & SESSIONS
export const conferenceSessions = pgTable('conference_sessions', {
  id: varchar('id', { length: 64 }).primaryKey(),
  eventId: varchar('event_id', { length: 64 }).references(() => events.id).notNull(),
  dayNumber: integer('day_number').notNull(),
  sessionDate: varchar('session_date', { length: 64 }).notNull(),
  timeWindow: varchar('time_window', { length: 64 }).notNull(),
  title: text('title').notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  venueLocation: text('venue_location').notNull(),
  description: text('description').notNull(),
  ministers: jsonb('ministers').$type<string[]>(),
  isHighlight: boolean('is_highlight').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// 10. ANNOUNCEMENTS & BROADCASTS
export const announcements = pgTable('announcements', {
  id: varchar('id', { length: 64 }).primaryKey(),
  eventId: varchar('event_id', { length: 64 }).references(() => events.id).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: varchar('type', { length: 32 }).notNull().default('info'), // 'urgent', 'info', 'schedule', 'transport', 'merchandise'
  targetAudience: varchar('target_audience', { length: 64 }).notNull().default('All Attendees'),
  author: text('author').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  isPinned: boolean('is_pinned').default(false).notNull(),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at')
})

// 11. AUDIT LOGS
export const auditLogs = pgTable('audit_logs', {
  id: varchar('id', { length: 64 }).primaryKey(),
  eventId: varchar('event_id', { length: 64 }),
  actorUserId: varchar('actor_user_id', { length: 64 }),
  action: varchar('action', { length: 64 }).notNull(), // 'ticket.checked_in', 'voucher.collected', 'announcement.published', 'blueprint.cloned'
  targetEntity: varchar('target_entity', { length: 64 }).notNull(),
  targetId: varchar('target_id', { length: 64 }).notNull(),
  payload: jsonb('payload'),
  ipAddress: varchar('ip_address', { length: 45 }),
  timestamp: timestamp('timestamp').defaultNow().notNull()
})
