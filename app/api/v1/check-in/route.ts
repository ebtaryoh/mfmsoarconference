import { NextRequest, NextResponse } from 'next/server'
import { eos } from '@/lib/services/event-service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { ticketCodeOrRef, gateName, usherUserId, checkInMethod, operationId } = body

    if (!ticketCodeOrRef) {
      return NextResponse.json({ error: 'Missing ticket code or reference' }, { status: 400 })
    }

    const result = eos.checkInTicket({
      ticketCodeOrRef,
      gateName: gateName || 'Gate 1 (Main Concourse)',
      usherUserId: usherUserId || 'Usher Station',
      checkInMethod: checkInMethod || 'qr_scanner',
      operationId
    })

    if (result.status === 'invalid') {
      return NextResponse.json(result, { status: 404 })
    }

    if (result.status === 'already_checked_in') {
      return NextResponse.json(result, { status: 409 }) // Conflict status
    }

    if (result.status === 'voucher_redirect') {
      return NextResponse.json(result, { status: 422 }) // Unprocessable entity (Voucher not ticket)
    }

    return NextResponse.json(result, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Check-in validation failure' }, { status: 500 })
  }
}
