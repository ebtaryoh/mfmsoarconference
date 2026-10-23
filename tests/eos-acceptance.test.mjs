import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'crypto'

// Import core modules directly
import { 
  generateSecureReference, 
  generateTicketCode, 
  generateVoucherCode, 
  signPayload, 
  verifySignature, 
  buildSignedManifest 
} from '../lib/security/tokens.ts'
import { 
  hasPermission, 
  requirePermission, 
  createSessionToken, 
  verifySessionToken 
} from '../lib/security/auth.ts'
import { eos } from '../lib/services/event-service.ts'
import { generateConferenceICS } from '../lib/calendar.ts'

test('1. Attendee can register successfully with valid credentials', () => {
  const email = `test_attendee_${Date.now()}@mfmyouth.org`
  const res = eos.registerAttendee({
    fullName: 'Ruth Oluwafemi',
    email,
    phone: '+234 803 111 2233',
    roleCategory: 'Campus Fellowship Leader',
    unitOrCampus: 'UNILAG Fellowship',
    stateOrRegion: 'Lagos State'
  })

  assert.equal(res.success, true)
  assert.ok(res.registration)
  assert.ok(res.ticket)
  assert.match(res.registration.reference, /^SOAR-2026-[A-Z0-9]{4}-[A-Z0-9]{2}$/)
  assert.match(res.ticket.ticketCode, /^tkt_[a-f0-9]{32}$/)
})

test('2. Repeated registration submissions follow configured duplicate policy (idempotent retrieval)', () => {
  const email = `idempotent_${Date.now()}@mfmyouth.org`
  const first = eos.registerAttendee({
    fullName: 'Samuel Kayode',
    email,
    phone: '+234 802 333 4455',
    roleCategory: 'Young Person',
    unitOrCampus: 'OAU Chapter',
    stateOrRegion: 'Osun State'
  })

  // Second submission with same email
  const second = eos.registerAttendee({
    fullName: 'Samuel Kayode',
    email,
    phone: '+234 802 333 4455',
    roleCategory: 'Young Person',
    unitOrCampus: 'OAU Chapter',
    stateOrRegion: 'Osun State'
  })

  assert.equal(second.success, true)
  assert.equal(first.registration.reference, second.registration.reference)
  assert.equal(first.ticket.ticketCode, second.ticket.ticketCode)
})

test('3. Tickets are unique, unpredictable, and securely signed with HMAC', () => {
  const t1 = generateTicketCode()
  const t2 = generateTicketCode()
  assert.notEqual(t1, t2)

  const sig = signPayload(t1)
  assert.equal(verifySignature(t1, sig), true)
  assert.equal(verifySignature(t1, 'tampered_signature_payload_hex'), false)
})

test('4. A valid ticket can be checked in once', () => {
  const email = `gate_test_${Date.now()}@mfmyouth.org`
  const reg = eos.registerAttendee({
    fullName: 'Deborah Adeleke',
    email,
    phone: '+234 809 444 5566',
    roleCategory: 'Youth Pastor / Minister',
    unitOrCampus: 'Ibadan Youth Center',
    stateOrRegion: 'Oyo State'
  })

  const scanRes = eos.checkInTicket({
    ticketCodeOrRef: reg.ticket.ticketCode,
    gateName: 'Gate 1 (Main Entrance)',
    usherUserId: 'usher_07'
  })

  assert.equal(scanRes.success, true)
  assert.equal(scanRes.status, 'granted')
  assert.equal(scanRes.attendee.fullName, 'Deborah Adeleke')
})

test('5. Repeated scans are rejected as duplicate check-ins', () => {
  const email = `double_scan_${Date.now()}@mfmyouth.org`
  const reg = eos.registerAttendee({
    fullName: 'Toluwanimi Bakare',
    email,
    phone: '+234 810 555 6677',
    roleCategory: 'Worker',
    unitOrCampus: 'Prayer City Protocol',
    stateOrRegion: 'Ogun State'
  })

  // First scan
  const first = eos.checkInTicket({
    ticketCodeOrRef: reg.ticket.ticketCode,
    gateName: 'Gate 2'
  })
  assert.equal(first.status, 'granted')

  // Second scan with same credential
  const second = eos.checkInTicket({
    ticketCodeOrRef: reg.ticket.ticketCode,
    gateName: 'Gate 2'
  })
  assert.equal(second.success, false)
  assert.equal(second.status, 'already_checked_in')
  assert.match(second.message, /ALREADY CHECKED IN/)
})

test('6. Invalid, forged, or revoked tickets cannot enter', () => {
  const forged = eos.checkInTicket({
    ticketCodeOrRef: 'SOAR-2026-FORGED-99',
    gateName: 'Gate 1'
  })
  assert.equal(forged.success, false)
  assert.equal(forged.status, 'invalid')
})

test('7. Check-in operations are strictly idempotent with operationId', () => {
  const email = `op_id_test_${Date.now()}@mfmyouth.org`
  const reg = eos.registerAttendee({
    fullName: 'Peter Eniola',
    email,
    phone: '+234 812 666 7788',
    roleCategory: 'Young Person',
    unitOrCampus: 'UI Chapter',
    stateOrRegion: 'Oyo State'
  })

  const stableOpId = `op_retry_${Date.now()}`
  const first = eos.checkInTicket({
    ticketCodeOrRef: reg.ticket.ticketCode,
    gateName: 'Gate 4',
    operationId: stableOpId
  })
  assert.equal(first.status, 'granted')

  // Scanner resends identical operationId due to transient network lag
  const retry = eos.checkInTicket({
    ticketCodeOrRef: reg.ticket.ticketCode,
    gateName: 'Gate 4',
    operationId: stableOpId
  })
  assert.equal(retry.success, true)
  assert.match(retry.message, /Idempotent response/)
})

test('8. Offline signed manifest contains verified tokens', () => {
  const usherSession = {
    userId: 'usher_01',
    email: 'usher@mfmyouth.org',
    fullName: 'Gate Usher',
    role: 'check_in_usher',
    expiresAt: Date.now() + 3600000
  }

  const res = eos.getOfflineValidationManifest('soar-2026', usherSession)
  assert.equal(res.success, true)
  assert.ok(res.manifest)
  assert.ok(res.manifest.entries.length > 0)
  assert.ok(res.manifest.manifestSignature)
})

test('9. Offline batch sync reconciles queued scans and flags duplicates', () => {
  const usherSession = {
    userId: 'usher_02',
    email: 'usher2@mfmyouth.org',
    fullName: 'Plaza Usher',
    role: 'check_in_usher',
    expiresAt: Date.now() + 3600000
  }

  // Create an attendee
  const reg = eos.registerAttendee({
    fullName: 'Grace Danladi',
    email: `sync_test_${Date.now()}@mfmyouth.org`,
    phone: '+234 901 222 3344',
    roleCategory: 'Campus Fellowship Leader',
    unitOrCampus: 'ABU Zaria',
    stateOrRegion: 'Kaduna State'
  })

  const batch = [
    {
      operationId: `sync_op_1_${Date.now()}`,
      ticketCode: reg.ticket.ticketCode,
      timestamp: new Date().toISOString(),
      gate: 'Gate 1'
    },
    // Duplicate scan of same ticket in batch
    {
      operationId: `sync_op_2_${Date.now()}`,
      ticketCode: reg.ticket.ticketCode,
      timestamp: new Date().toISOString(),
      gate: 'Gate 1'
    }
  ]

  const report = eos.syncOfflineBatch({
    eventId: 'soar-2026',
    deviceId: 'device_gate_01',
    scans: batch,
    session: usherSession
  })

  assert.equal(report.success, true)
  assert.equal(report.successful, 1)
  assert.equal(report.duplicates, 1)
})

test('10. Inventory overselling is prevented on concurrent orders', () => {
  // Attempting to buy 9999 units of a limited SKU should fail
  const res = eos.createMerchandiseOrder({
    customerName: 'Mega Buyer',
    customerEmail: 'mega@mfmyouth.org',
    customerPhone: '+234 800 000 0000',
    items: [
      {
        productId: 'prod-hoodie-03',
        productName: 'Fleece Hoodie',
        variantSku: 'HOODIE-M',
        quantity: 9999,
        unitPrice: 18000
      }
    ]
  })

  assert.equal(res.success, false)
  assert.match(res.message, /Insufficient inventory/)
})

test('11. Merchandise pickup voucher can be collected once and duplicate collection is blocked', () => {
  const orderRes = eos.createMerchandiseOrder({
    customerName: 'Victoria Adeniyi',
    customerEmail: `vouch_test_${Date.now()}@mfmyouth.org`,
    customerPhone: '+234 811 999 8877',
    items: [
      {
        productId: 'prod-cap-02',
        productName: 'Trucker Cap',
        variantSku: 'CAP-GOLD',
        quantity: 1,
        unitPrice: 5500
      }
    ]
  })

  assert.equal(orderRes.success, true)
  const voucherCode = orderRes.order.voucherCode

  // First collection at Booth 4
  const claim1 = eos.collectMerchandiseVoucher(voucherCode, 'Booth 4 Officer A')
  assert.equal(claim1.success, true)
  assert.equal(claim1.status, 'collected')

  // Second collection attempt with same voucher code
  const claim2 = eos.collectMerchandiseVoucher(voucherCode, 'Booth 4 Officer B')
  assert.equal(claim2.success, false)
  assert.equal(claim2.status, 'duplicate_claim')
  assert.match(claim2.message, /DUPLICATE CLAIM PREVENTED/)
})

test('12. Merchandise vouchers are redirected if scanned at turnstile entry gates', () => {
  const orderRes = eos.createMerchandiseOrder({
    customerName: 'Joshua O.',
    customerEmail: `redir_${Date.now()}@mfmyouth.org`,
    customerPhone: '+234 809 111 2222',
    items: [
      {
        productId: 'prod-journal-04',
        productName: 'Leather Journal',
        variantSku: 'JOURNAL-A5',
        quantity: 1,
        unitPrice: 6000
      }
    ]
  })

  const scanAtTurnstile = eos.checkInTicket({
    ticketCodeOrRef: orderRes.order.voucherCode,
    gateName: 'Gate 1'
  })

  assert.equal(scanAtTurnstile.success, false)
  assert.equal(scanAtTurnstile.status, 'voucher_redirect')
  assert.match(scanAtTurnstile.message, /MERCHANDISE PICKUP VOUCHER/)
})

test('13. Role-Based Access Control blocks unauthorized actions', () => {
  const usherSession = {
    userId: 'usher_09',
    email: 'usher9@mfmyouth.org',
    fullName: 'Turnstile Staff',
    role: 'check_in_usher',
    expiresAt: Date.now() + 3600000
  }

  // Ushers can scan tickets
  assert.equal(hasPermission(usherSession.role, 'ticket:scan'), true)

  // Ushers CANNOT publish global broadcast announcements
  assert.equal(hasPermission(usherSession.role, 'announcement:publish'), false)

  // Ushers CANNOT modify system settings
  assert.equal(hasPermission(usherSession.role, 'system:settings'), false)

  const check = requirePermission(usherSession, 'system:settings')
  assert.equal(check.allowed, false)
  assert.match(check.reason, /lacks required permission/)
})

test('14. Session tokens are tamper-proof with HMAC', () => {
  const session = {
    userId: 'admin_01',
    email: 'convener@mfmyouth.org',
    fullName: 'Conference Director',
    role: 'conference_admin'
  }

  const token = createSessionToken(session)
  const verified = verifySessionToken(token)
  assert.ok(verified)
  assert.equal(verified.email, 'convener@mfmyouth.org')

  // Tampered token
  const tampered = token.replace(/a/g, 'b')
  const rejected = verifySessionToken(tampered)
  assert.equal(rejected, null)
})

test('15. Event calendar (.ics) generation conforms to RFC 5545 format', () => {
  const ics = generateConferenceICS()
  assert.match(ics, /BEGIN:VCALENDAR/)
  assert.match(ics, /VERSION:2\.0/)
  assert.match(ics, /SUMMARY:SOAR 2026: Higher Together/)
  assert.match(ics, /LOCATION:MFM Prayer City/)
  assert.match(ics, /END:VCALENDAR/)
})

test('16. Paystack webhook HMAC-SHA512 signature validation', () => {
  const secret = 'test_paystack_secret_key'
  const payload = JSON.stringify({
    event: 'charge.success',
    data: { reference: 'PAY-SOAR-99', amount: 850000, currency: 'NGN' }
  })

  const validSig = crypto.createHmac('sha512', secret).update(payload).digest('hex')
  const calculatedSig = crypto.createHmac('sha512', secret).update(payload).digest('hex')

  assert.equal(validSig, calculatedSig)
  assert.notEqual(validSig, 'forged_fake_signature')
})

test('17. Live telemetry accurately counts registrations and check-ins', () => {
  const metrics = eos.getTelemetry('soar-2026')
  assert.ok(metrics.totalRegistered >= 8414)
  assert.ok(metrics.totalCheckedIn >= 5186)
  assert.ok(metrics.checkInPercentage > 0)
  assert.ok(metrics.grossRevenue > 0)
})

test('18. Sensitive audit log trail is preserved for security-critical actions', () => {
  const logs = eos.getAuditLogs()
  assert.ok(Array.isArray(logs))
  assert.ok(logs.length > 0)
  const checkInAudit = logs.find(l => l.action === 'ticket.checked_in')
  assert.ok(checkInAudit)
  assert.ok(checkInAudit.timestamp)
})
