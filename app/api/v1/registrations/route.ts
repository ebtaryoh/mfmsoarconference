import { NextRequest, NextResponse } from 'next/server'
import { eos } from '@/lib/services/event-service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = eos.registerAttendee(body, body.eventId || 'soar-2026')

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      registration: result.registration,
      ticket: result.ticket
    }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  if (!q) {
    // Return summary count
    const all = eos.getAllAttendees()
    return NextResponse.json({ count: all.length })
  }

  const found = eos.getAttendeeByReference(q)
  if (!found) {
    return NextResponse.json({ error: 'Attendee credentials not found' }, { status: 404 })
  }

  return NextResponse.json({
    registration: found.registration,
    ticket: found.ticket,
    checkIn: found.checkIn
  })
}
