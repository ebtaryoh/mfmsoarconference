import { NextRequest, NextResponse } from 'next/server'
import { eos } from '@/lib/services/event-service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = eos.createMerchandiseOrder({
      eventId: body.eventId || 'soar-2026',
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      registrationReference: body.registrationReference,
      items: body.items
    })

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      order: result.order
    }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
