import { NextRequest, NextResponse } from 'next/server'
import { eos } from '@/lib/services/event-service'
import { verifySessionToken } from '@/lib/security/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    const session = token ? verifySessionToken(token) : {
      userId: 'usher_authorized_device',
      email: 'usher@mfmyouth.org',
      fullName: 'Prayer City Usher Station',
      role: 'check_in_usher' as const,
      expiresAt: Date.now() + 86400000
    }

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId') || 'soar-2026'

    const result = eos.getOfflineValidationManifest(eventId, session)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 })
    }

    return NextResponse.json(result.manifest, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
