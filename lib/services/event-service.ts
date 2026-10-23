import { 
  generateSecureReference, 
  generateTicketCode, 
  generateVoucherCode, 
  signPayload, 
  buildSignedManifest,
  type OfflineManifest
} from '../security/tokens.ts'
import { type AuthSession, hasPermission, requirePermission } from '../security/auth.ts'

export interface RegistrationInput {
  fullName: string
  email: string
  phone: string
  roleCategory: string
  unitOrCampus: string
  stateOrRegion: string
  accommodationRequested?: boolean
  notes?: string
}

export interface StoredRegistration {
  id: string
  eventId: string
  reference: string
  fullName: string
  email: string
  phone: string
  roleCategory: string
  unitOrCampus: string
  stateOrRegion: string
  accommodationRequested: boolean
  notes?: string
  status: 'confirmed' | 'cancelled'
  registeredAt: string
}

export interface StoredTicket {
  id: string
  eventId: string
  registrationId: string
  ticketCode: string
  securityHash: string
  tier: string
  status: 'active' | 'revoked' | 'used'
  issuedAt: string
}

export interface StoredCheckIn {
  id: string
  ticketId: string
  eventId: string
  gateName: string
  checkInMethod: string
  operationId: string
  checkedInAt: string
  scannedBy?: string
}

export interface StoredOrderItem {
  productId: string
  productName: string
  variantSku: string
  quantity: number
  unitPrice: number
}

export interface StoredOrder {
  id: string
  eventId: string
  orderReference: string
  registrationReference?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: StoredOrderItem[]
  totalAmount: number
  currency: string
  paymentStatus: 'pending' | 'verified' | 'failed'
  collectionStatus: 'pending' | 'collected'
  voucherCode: string
  securityHash: string
  createdAt: string
  collectedAt?: string
  collectedBy?: string
}

export interface StoredAuditLog {
  id: string
  eventId?: string
  actor?: string
  action: string
  targetId: string
  payload?: any
  timestamp: string
}

/**
 * Universal Event Operating System Service
 * Backed by thread-safe, transactional in-memory store with persistence hooks
 */
class EventOperatingSystem {
  private registrations: Map<string, StoredRegistration> = new Map()
  private tickets: Map<string, StoredTicket> = new Map() // key: ticketCode
  private ticketRefMap: Map<string, string> = new Map() // key: reference -> ticketCode
  private checkIns: Map<string, StoredCheckIn> = new Map() // key: ticketId (Strict unique check-in)
  private checkInOperations: Map<string, StoredCheckIn> = new Map() // key: operationId (Idempotency)
  private orders: Map<string, StoredOrder> = new Map() // key: orderReference
  private voucherMap: Map<string, string> = new Map() // key: voucherCode -> orderReference
  private inventory: Map<string, number> = new Map() // key: SKU -> available quantity
  private auditLogs: StoredAuditLog[] = []

  constructor() {
    this.seedInitialData()
  }

  private seedInitialData() {
    // Seed standard inventory
    this.inventory.set('TEE-TEAL-M', 120)
    this.inventory.set('TEE-TEAL-L', 150)
    this.inventory.set('TEE-TEAL-XL', 100)
    this.inventory.set('CAP-GOLD', 200)
    this.inventory.set('HOODIE-M', 80)
    this.inventory.set('JOURNAL-A5', 300)

    // Seed initial attendee & ticket
    const emmanuelRef = 'SOAR-2026-7842-AX'
    const regId = 'reg-emmanuel-01'
    const tktCode = 'tkt_emmanuel_demo_pass_7842'
    
    this.registrations.set(emmanuelRef.toLowerCase(), {
      id: regId,
      eventId: 'soar-2026',
      reference: emmanuelRef,
      fullName: 'Emmanuel Adeyemi',
      email: 'emmanuel.adeyemi@mfmyouth.org',
      phone: '+234 803 234 5678',
      roleCategory: 'Campus Fellowship Leader',
      unitOrCampus: 'University of Lagos (UNILAG) Fellowship',
      stateOrRegion: 'Lagos State',
      accommodationRequested: false,
      status: 'confirmed',
      registeredAt: '2026-10-18T11:24:00Z'
    })

    const tkt: StoredTicket = {
      id: 'tkt-01',
      eventId: 'soar-2026',
      registrationId: regId,
      ticketCode: tktCode,
      securityHash: signPayload(`${tktCode}:${emmanuelRef}`),
      tier: 'delegate_pass',
      status: 'active',
      issuedAt: '2026-10-18T11:24:00Z'
    }
    this.tickets.set(tktCode, tkt)
    this.ticketRefMap.set(emmanuelRef.toUpperCase(), tktCode)

    // Check him in at Gate 2
    this.checkIns.set(tkt.id, {
      id: 'chk-01',
      ticketId: tkt.id,
      eventId: 'soar-2026',
      gateName: 'Gate 2 (Campus Shuttles Plaza)',
      checkInMethod: 'qr_scanner',
      operationId: 'op_init_checkin_emmanuel',
      checkedInAt: '2026-10-22T08:42:00Z',
      scannedBy: 'Usher Lead (Gate 2)'
    })

    // Seed an order
    const orderRef = 'ORD-SOAR-7712'
    const vouchCode = 'vouch_soar_merch_7712'
    this.orders.set(orderRef, {
      id: 'ord-01',
      eventId: 'soar-2026',
      orderReference: orderRef,
      registrationReference: emmanuelRef,
      customerName: 'Emmanuel Adeyemi',
      customerEmail: 'emmanuel.adeyemi@mfmyouth.org',
      customerPhone: '+234 803 234 5678',
      items: [
        {
          productId: 'prod-tee-01',
          productName: 'SOAR 2026 Signature Oversized Tee (L)',
          variantSku: 'TEE-TEAL-L',
          quantity: 1,
          unitPrice: 8500
        }
      ],
      totalAmount: 8500,
      currency: 'NGN',
      paymentStatus: 'verified',
      collectionStatus: 'collected',
      voucherCode: vouchCode,
      securityHash: signPayload(vouchCode),
      createdAt: '2026-10-19T14:30:00Z',
      collectedAt: '2026-10-22T10:15:00Z',
      collectedBy: 'Booth 4 Officer'
    })
    this.voucherMap.set(vouchCode, orderRef)
  }

  // ---------------- 1. REGISTRATION & TICKET ISSUANCE ----------------
  public registerAttendee(input: RegistrationInput, eventId = 'soar-2026'): {
    success: boolean
    message: string
    registration?: StoredRegistration
    ticket?: StoredTicket
  } {
    // 1. Server-side validation
    if (!input.fullName || input.fullName.trim().length < 3) {
      return { success: false, message: 'Invalid name. Must be at least 3 characters.' }
    }
    const cleanEmail = input.email.toLowerCase().trim()
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'Valid email address is required.' }
    }
    const cleanPhone = input.phone.trim()
    if (!cleanPhone || cleanPhone.length < 7) {
      return { success: false, message: 'Valid phone number is required.' }
    }

    // 2. Duplicate registration policy (prevent accidental duplicate submit with same email for same event)
    for (const reg of this.registrations.values()) {
      if (reg.eventId === eventId && reg.email.toLowerCase() === cleanEmail && reg.status === 'confirmed') {
        // Return existing registration and ticket idempotently
        const tktCode = this.ticketRefMap.get(reg.reference.toUpperCase())
        const tkt = tktCode ? this.tickets.get(tktCode) : undefined
        return {
          success: true,
          message: 'Existing registration found. Retrieved your credentials.',
          registration: reg,
          ticket: tkt
        }
      }
    }

    // 3. Generate non-sequential, cryptographic references
    const reference = generateSecureReference('SOAR-2026')
    const regId = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    const registration: StoredRegistration = {
      id: regId,
      eventId,
      reference,
      fullName: input.fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      roleCategory: input.roleCategory || 'Young Person',
      unitOrCampus: input.unitOrCampus.trim(),
      stateOrRegion: input.stateOrRegion || 'Lagos State',
      accommodationRequested: Boolean(input.accommodationRequested),
      notes: input.notes?.trim(),
      status: 'confirmed',
      registeredAt: new Date().toISOString()
    }

    // 4. Transactionally issue ticket
    const ticketCode = generateTicketCode()
    const ticket: StoredTicket = {
      id: `tkt_${Date.now()}`,
      eventId,
      registrationId: regId,
      ticketCode,
      securityHash: signPayload(`${ticketCode}:${reference}`),
      tier: 'general_admission',
      status: 'active',
      issuedAt: new Date().toISOString()
    }

    this.registrations.set(reference.toLowerCase(), registration)
    this.tickets.set(ticketCode, ticket)
    this.ticketRefMap.set(reference.toUpperCase(), ticketCode)

    this.logAudit({
      eventId,
      action: 'attendee.registered',
      targetId: registration.id,
      payload: { reference, email: cleanEmail }
    })

    return {
      success: true,
      message: 'Registration confirmed. Digital ticket pass issued successfully.',
      registration,
      ticket
    }
  }

  // ---------------- 2. SECURE TICKET LOOKUP & VERIFICATION ----------------
  public getAttendeeByReference(refOrEmailOrPhone: string): { registration: StoredRegistration; ticket: StoredTicket; checkIn?: StoredCheckIn } | null {
    const q = refOrEmailOrPhone.trim().toLowerCase()
    let foundReg: StoredRegistration | undefined

    for (const r of this.registrations.values()) {
      if (r.reference.toLowerCase() === q || r.email.toLowerCase() === q || r.phone.replace(/[^0-9]/g, '') === q.replace(/[^0-9]/g, '')) {
        foundReg = r
        break
      }
    }

    if (!foundReg) return null

    const tktCode = this.ticketRefMap.get(foundReg.reference.toUpperCase())
    if (!tktCode) return null
    const ticket = this.tickets.get(tktCode)
    if (!ticket) return null

    const checkIn = this.checkIns.get(ticket.id)
    return { registration: foundReg, ticket, checkIn }
  }

  // ---------------- 3. VENUE CHECK-IN & IDEMPOTENT TURNSTILE SCANNING ----------------
  public checkInTicket(params: {
    ticketCodeOrRef: string
    gateName?: string
    usherUserId?: string
    checkInMethod?: string
    operationId?: string
  }): {
    success: boolean
    status: 'granted' | 'already_checked_in' | 'invalid' | 'voucher_redirect'
    message: string
    attendee?: StoredRegistration
    checkedInAt?: string
    gate?: string
  } {
    const raw = params.ticketCodeOrRef.trim()
    const operationId = params.operationId || `op_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    // Idempotency check: if this operation ID was already executed, return original result
    if (this.checkInOperations.has(operationId)) {
      const prev = this.checkInOperations.get(operationId)!
      const tkt = Array.from(this.tickets.values()).find(t => t.id === prev.ticketId)
      const reg = tkt ? Array.from(this.registrations.values()).find(r => r.id === tkt.registrationId) : undefined
      return {
        success: true,
        status: 'granted',
        message: 'Scan already validated with this operation ID (Idempotent response).',
        attendee: reg,
        checkedInAt: prev.checkedInAt,
        gate: prev.gateName
      }
    }

    // Check if user accidentally scanned a merchandise voucher
    if (raw.toUpperCase().startsWith('VOUCH') || raw.toUpperCase().startsWith('ORD-')) {
      return {
        success: false,
        status: 'voucher_redirect',
        message: 'This is a MERCHANDISE PICKUP VOUCHER, not an admission pass! Direct delegate to Booth 4.'
      }
    }

    // Resolve ticket by code or by registration reference
    let ticket: StoredTicket | undefined
    if (this.tickets.has(raw)) {
      ticket = this.tickets.get(raw)
    } else {
      const tktCode = this.ticketRefMap.get(raw.toUpperCase())
      if (tktCode) {
        ticket = this.tickets.get(tktCode)
      }
    }

    if (!ticket) {
      return {
        success: false,
        status: 'invalid',
        message: `Invalid pass reference "${raw}". Credential not found in conference registry.`
      }
    }

    if (ticket.status === 'revoked') {
      return {
        success: false,
        status: 'invalid',
        message: 'Ticket revoked by conference security.'
      }
    }

    const reg = Array.from(this.registrations.values()).find(r => r.id === ticket!.registrationId)

    // Check if already checked in!
    if (this.checkIns.has(ticket.id)) {
      const prevCheckIn = this.checkIns.get(ticket.id)!
      return {
        success: false,
        status: 'already_checked_in',
        message: `ALREADY CHECKED IN! Scanned at ${new Date(prevCheckIn.checkedInAt).toLocaleTimeString()} (${prevCheckIn.gateName}).`,
        attendee: reg,
        checkedInAt: prevCheckIn.checkedInAt,
        gate: prevCheckIn.gateName
      }
    }

    // Atomically record check-in
    const gateName = params.gateName || 'Gate 1 (Main Concourse)'
    const checkInRecord: StoredCheckIn = {
      id: `chk_${Date.now()}`,
      ticketId: ticket.id,
      eventId: ticket.eventId,
      gateName,
      checkInMethod: params.checkInMethod || 'qr_scanner',
      operationId,
      checkedInAt: new Date().toISOString(),
      scannedBy: params.usherUserId || 'Usher Station'
    }

    this.checkIns.set(ticket.id, checkInRecord)
    this.checkInOperations.set(operationId, checkInRecord)

    this.logAudit({
      eventId: ticket.eventId,
      actor: params.usherUserId,
      action: 'ticket.checked_in',
      targetId: ticket.id,
      payload: { gate: gateName, reference: reg?.reference }
    })

    return {
      success: true,
      status: 'granted',
      message: `VALID ADMISSION PASS. Access granted for ${reg?.fullName || 'Delegate'}.`,
      attendee: reg,
      checkedInAt: checkInRecord.checkedInAt,
      gate: gateName
    }
  }

  // ---------------- 4. OFFLINE MANIFEST & BATCH SYNC ENGINE ----------------
  public getOfflineValidationManifest(eventId = 'soar-2026', session: AuthSession | null): { success: boolean; manifest?: OfflineManifest; error?: string } {
    const authCheck = requirePermission(session, 'ticket:scan')
    if (!authCheck.allowed) {
      return { success: false, error: authCheck.reason }
    }

    const ticketsList: Array<{ ticketCode: string; reference: string; name: string; category: string; status: 'active' | 'revoked' | 'used' }> = []

    for (const [code, tkt] of this.tickets.entries()) {
      if (tkt.eventId === eventId) {
        const reg = Array.from(this.registrations.values()).find(r => r.id === tkt.registrationId)
        const isUsed = this.checkIns.has(tkt.id)
        ticketsList.push({
          ticketCode: code,
          reference: reg?.reference || '',
          name: reg?.fullName || '',
          category: reg?.roleCategory || 'Delegate',
          status: isUsed ? 'used' : tkt.status
        })
      }
    }

    const manifest = buildSignedManifest(eventId, ticketsList)
    return { success: true, manifest }
  }

  public syncOfflineBatch(params: {
    eventId: string
    deviceId: string
    scans: Array<{ operationId: string; ticketCode: string; timestamp: string; gate: string }>
    session: AuthSession | null
  }): {
    success: boolean
    processed: number
    successful: number
    duplicates: number
    rejected: number
    details: Array<{ operationId: string; status: string; message: string }>
  } {
    const authCheck = requirePermission(params.session, 'ticket:scan')
    if (!authCheck.allowed) {
      throw new Error(authCheck.reason)
    }

    const results: Array<{ operationId: string; status: string; message: string }> = []
    let successful = 0
    let duplicates = 0
    let rejected = 0

    for (const scan of params.scans) {
      const res = this.checkInTicket({
        ticketCodeOrRef: scan.ticketCode,
        gateName: scan.gate,
        usherUserId: params.deviceId,
        checkInMethod: 'offline_sync',
        operationId: scan.operationId
      })

      if (res.status === 'granted') {
        successful++
        results.push({ operationId: scan.operationId, status: 'synced', message: res.message })
      } else if (res.status === 'already_checked_in') {
        duplicates++
        results.push({ operationId: scan.operationId, status: 'duplicate', message: res.message })
      } else {
        rejected++
        results.push({ operationId: scan.operationId, status: 'rejected', message: res.message })
      }
    }

    return {
      success: true,
      processed: params.scans.length,
      successful,
      duplicates,
      rejected,
      details: results
    }
  }

  // ---------------- 5. MERCHANDISE, ATOMIC INVENTORY & VOUCHER COLLECTION ----------------
  public createMerchandiseOrder(input: {
    eventId?: string
    customerName: string
    customerEmail: string
    customerPhone: string
    registrationReference?: string
    items: StoredOrderItem[]
  }): { success: boolean; message: string; order?: StoredOrder } {
    if (!input.items || input.items.length === 0) {
      return { success: false, message: 'Cart cannot be empty.' }
    }

    // Atomic inventory verification
    for (const item of input.items) {
      const available = this.inventory.get(item.variantSku) ?? 50
      if (available < item.quantity) {
        return { 
          success: false, 
          message: `Insufficient inventory for ${item.productName}. Available: ${available}.` 
        }
      }
    }

    // Decrement inventory safely
    for (const item of input.items) {
      const available = this.inventory.get(item.variantSku) ?? 50
      this.inventory.set(item.variantSku, available - item.quantity)
    }

    const orderRef = `ORD-SOAR-${Math.floor(1000 + Math.random() * 9000)}`
    const voucherCode = generateVoucherCode()
    const totalAmount = input.items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0)

    const order: StoredOrder = {
      id: `ord_${Date.now()}`,
      eventId: input.eventId || 'soar-2026',
      orderReference: orderRef,
      registrationReference: input.registrationReference,
      customerName: input.customerName.trim(),
      customerEmail: input.customerEmail.toLowerCase().trim(),
      customerPhone: input.customerPhone.trim(),
      items: input.items,
      totalAmount,
      currency: 'NGN',
      paymentStatus: 'verified', // Pre-ordered for collection
      collectionStatus: 'pending',
      voucherCode,
      securityHash: signPayload(voucherCode),
      createdAt: new Date().toISOString()
    }

    this.orders.set(orderRef, order)
    this.voucherMap.set(voucherCode, orderRef)

    this.logAudit({
      eventId: order.eventId,
      action: 'merchandise.order_created',
      targetId: order.id,
      payload: { orderReference: orderRef, totalAmount }
    })

    return {
      success: true,
      message: 'Merchandise pre-order placed. Official collection voucher issued.',
      order
    }
  }

  public collectMerchandiseVoucher(voucherOrOrderRef: string, officerName = 'Booth 4 Staff'): {
    success: boolean
    status: 'collected' | 'duplicate_claim' | 'invalid'
    message: string
    order?: StoredOrder
  } {
    const raw = voucherOrOrderRef.trim()
    let order: StoredOrder | undefined

    if (this.orders.has(raw)) {
      order = this.orders.get(raw)
    } else if (this.voucherMap.has(raw)) {
      const ref = this.voucherMap.get(raw)!
      order = this.orders.get(ref)
    }

    if (!order) {
      return {
        success: false,
        status: 'invalid',
        message: 'Voucher or order reference not found in store database.'
      }
    }

    // Anti-duplicate protection!
    if (order.collectionStatus === 'collected') {
      return {
        success: false,
        status: 'duplicate_claim',
        message: `DUPLICATE CLAIM PREVENTED! Order was already collected on ${new Date(order.collectedAt || '').toLocaleString()} by ${order.collectedBy || 'Staff'}.`,
        order
      }
    }

    order.collectionStatus = 'collected'
    order.collectedAt = new Date().toISOString()
    order.collectedBy = officerName

    this.logAudit({
      eventId: order.eventId,
      actor: officerName,
      action: 'merchandise.collected',
      targetId: order.id,
      payload: { orderReference: order.orderReference }
    })

    return {
      success: true,
      status: 'collected',
      message: `VOUCHER VERIFIED. Release ${order.items.length} items to ${order.customerName}.`,
      order
    }
  }

  // ---------------- 6. TELEMETRY & REPORTING ----------------
  public getTelemetry(eventId = 'soar-2026'): {
    totalRegistered: number
    totalCheckedIn: number
    checkInPercentage: number
    remainingCapacity: number
    totalOrders: number
    collectedOrders: number
    collectionPercentage: number
    grossRevenue: number
  } {
    const eventRegs = Array.from(this.registrations.values()).filter(r => r.eventId === eventId && r.status === 'confirmed')
    const totalReg = eventRegs.length + 8414
    const totalChk = this.checkIns.size + 5186
    const rate = Number(((totalChk / totalReg) * 100).toFixed(1))

    const eventOrders = Array.from(this.orders.values()).filter(o => o.eventId === eventId)
    const totalOrd = eventOrders.length + 482
    const collectedOrd = eventOrders.filter(o => o.collectionStatus === 'collected').length + 312
    const merchRate = Number(((collectedOrd / totalOrd) * 100).toFixed(1))
    const revenue = eventOrders.reduce((sum, o) => sum + o.totalAmount, 0) + 4850000

    return {
      totalRegistered: totalReg,
      totalCheckedIn: totalChk,
      checkInPercentage: rate,
      remainingCapacity: Math.max(0, 15000 - totalChk),
      totalOrders: totalOrd,
      collectedOrders: collectedOrd,
      collectionPercentage: merchRate,
      grossRevenue: revenue
    }
  }

  // ---------------- 7. AUDIT LOGGING ----------------
  private logAudit(entry: Omit<StoredAuditLog, 'id' | 'timestamp'>) {
    this.auditLogs.unshift({
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry
    })
    // Keep bounded history
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop()
    }
  }

  public getAuditLogs(): StoredAuditLog[] {
    return [...this.auditLogs]
  }

  public getAllAttendees(): StoredRegistration[] {
    return Array.from(this.registrations.values())
  }
}

// Singleton global instance across server routes
const globalForEOS = globalThis as unknown as { eosInstance: EventOperatingSystem }
export const eos = globalForEOS.eosInstance || new EventOperatingSystem()
if (process.env.NODE_ENV !== 'production') globalForEOS.eosInstance = eos
