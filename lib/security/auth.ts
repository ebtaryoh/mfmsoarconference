import crypto from 'crypto'

export type UserRole = 
  | 'platform_admin'
  | 'org_admin'
  | 'conference_admin'
  | 'registration_manager'
  | 'check_in_usher'
  | 'merchandise_manager'
  | 'announcement_publisher'
  | 'analyst'
  | 'attendee'

export type Permission = 
  | 'ticket:scan'
  | 'ticket:manual_override'
  | 'attendee:read'
  | 'attendee:export'
  | 'merchandise:collect'
  | 'merchandise:manage_stock'
  | 'announcement:publish'
  | 'blueprint:manage'
  | 'analytics:read'
  | 'system:settings'

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  platform_admin: [
    'ticket:scan', 'ticket:manual_override', 'attendee:read', 'attendee:export',
    'merchandise:collect', 'merchandise:manage_stock', 'announcement:publish',
    'blueprint:manage', 'analytics:read', 'system:settings'
  ],
  org_admin: [
    'ticket:scan', 'ticket:manual_override', 'attendee:read', 'attendee:export',
    'merchandise:collect', 'merchandise:manage_stock', 'announcement:publish',
    'blueprint:manage', 'analytics:read', 'system:settings'
  ],
  conference_admin: [
    'ticket:scan', 'ticket:manual_override', 'attendee:read', 'attendee:export',
    'merchandise:collect', 'merchandise:manage_stock', 'announcement:publish',
    'blueprint:manage', 'analytics:read'
  ],
  registration_manager: [
    'ticket:manual_override', 'attendee:read', 'attendee:export', 'analytics:read'
  ],
  check_in_usher: [
    'ticket:scan', 'ticket:manual_override', 'attendee:read'
  ],
  merchandise_manager: [
    'merchandise:collect', 'merchandise:manage_stock'
  ],
  announcement_publisher: [
    'announcement:publish'
  ],
  analyst: [
    'analytics:read', 'attendee:read'
  ],
  attendee: []
}

export interface AuthSession {
  userId: string
  email: string
  fullName: string
  role: UserRole
  orgUnitId?: string
  eventId?: string
  expiresAt: number
}

const SESSION_SECRET = process.env.SESSION_SECRET || 'soar-auth-secret-key-salt-98124'

export function createSessionToken(session: Omit<AuthSession, 'expiresAt'>, expiresInHours = 24): string {
  const payload: AuthSession = {
    ...session,
    expiresAt: Date.now() + expiresInHours * 60 * 60 * 1000
  }
  const serialized = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(serialized).digest('base64url')
  return `${serialized}.${signature}`
}

export function verifySessionToken(token: string): AuthSession | null {
  try {
    const [serialized, signature] = token.split('.')
    if (!serialized || !signature) return null

    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(serialized).digest('base64url')
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null
    }

    const payload: AuthSession = JSON.parse(Buffer.from(serialized, 'base64url').toString('utf8'))
    if (Date.now() > payload.expiresAt) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowed = ROLE_PERMISSIONS[role] || []
  return allowed.includes(permission)
}

export function requirePermission(session: AuthSession | null, permission: Permission): { allowed: boolean; reason?: string } {
  if (!session) {
    return { allowed: false, reason: 'Authentication required. No active session token found.' }
  }
  if (!hasPermission(session.role, permission)) {
    return { 
      allowed: false, 
      reason: `Forbidden. Role '${session.role}' lacks required permission '${permission}'.` 
    }
  }
  return { allowed: true }
}
