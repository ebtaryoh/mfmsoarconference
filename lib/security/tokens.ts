import crypto from 'crypto'

const JWT_OR_HMAC_SECRET = process.env.EVENT_SECURITY_SECRET || 'soar-2026-mfm-youth-production-secret-salt-key-99'

/**
 * Generate a cryptographically strong, non-sequential registration reference
 * Format: SOAR-2026-XXXX-XX (where characters are high-entropy non-ambiguous base32)
 */
export function generateSecureReference(prefix = 'SOAR-2026'): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  const randomBytes = crypto.randomBytes(6)
  let p1 = ''
  for (let i = 0; i < 4; i++) {
    p1 += chars[randomBytes[i] % chars.length]
  }
  let p2 = ''
  for (let i = 4; i < 6; i++) {
    p2 += chars[randomBytes[i] % chars.length]
  }
  return `${prefix}-${p1}-${p2}`
}

/**
 * Generate a cryptographically unpredictable ticket QR code token
 */
export function generateTicketCode(): string {
  return `tkt_${crypto.randomBytes(16).toString('hex')}`
}

/**
 * Generate a cryptographically unpredictable merchandise voucher code
 */
export function generateVoucherCode(): string {
  return `vouch_${crypto.randomBytes(16).toString('hex')}`
}

/**
 * Sign a payload with HMAC-SHA256 for tamper detection
 */
export function signPayload(payload: string): string {
  return crypto
    .createHmac('sha256', JWT_OR_HMAC_SECRET)
    .update(payload)
    .digest('hex')
}

/**
 * Verify HMAC-SHA256 signature
 */
export function verifySignature(payload: string, signature: string): boolean {
  const expected = signPayload(payload)
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'))
  } catch {
    return false
  }
}

/**
 * Generate signed offline validation manifest
 */
export interface OfflineManifestEntry {
  ticketCode: string
  reference: string
  attendeeHash: string
  name: string
  category: string
  status: 'active' | 'revoked' | 'used'
  sig: string
}

export interface OfflineManifest {
  eventId: string
  manifestVersion: number
  generatedAt: string
  expiresAt: string
  entries: OfflineManifestEntry[]
  manifestSignature: string
}

export function buildSignedManifest(
  eventId: string, 
  tickets: Array<{ ticketCode: string; reference: string; name: string; category: string; status: 'active' | 'revoked' | 'used' }>
): OfflineManifest {
  const now = new Date()
  const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days valid for conference

  const entries: OfflineManifestEntry[] = tickets.map(t => {
    const attendeeHash = crypto.createHash('sha256').update(t.name.toLowerCase().trim()).digest('hex').substring(0, 16)
    const entryData = `${t.ticketCode}:${t.reference}:${t.status}`
    return {
      ticketCode: t.ticketCode,
      reference: t.reference,
      attendeeHash,
      name: t.name,
      category: t.category,
      status: t.status,
      sig: signPayload(entryData)
    }
  })

  const manifestCore = `${eventId}:${entries.length}:${now.toISOString()}:${expires.toISOString()}`
  const manifestSignature = signPayload(manifestCore)

  return {
    eventId,
    manifestVersion: Math.floor(now.getTime() / 1000),
    generatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    entries,
    manifestSignature
  }
}
