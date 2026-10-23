import { NextRequest, NextResponse } from 'next/server'
import { eos } from '@/lib/services/event-service'
import { verifySessionToken } from '@/lib/security/auth'

export async function POST(req: NextRequest) {
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

    const body = await req.json()
    const { eventId, deviceId, scans } = body

    if (!Array.isArray(scans)) {
      return NextResponse.json({ error: 'scans must be an array of queued scan events' }, { status: 400 })
    }

    const syncReport = eos.syncOfflineBatch({
      eventId: eventId || 'soar-2026',
      deviceId: deviceId || 'device_offline_node',
      scans,
      session
    })

    return NextResponse.json(syncReport, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
