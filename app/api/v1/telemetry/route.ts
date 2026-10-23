import { NextRequest, NextResponse } from 'next/server'
import { eos } from '@/lib/services/event-service'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId') || 'soar-2026'

    const metrics = eos.getTelemetry(eventId)
    const auditCount = eos.getAuditLogs().length

    return NextResponse.json({
      ...metrics,
      auditLogCount: auditCount,
      timestamp: new Date().toISOString()
    }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
