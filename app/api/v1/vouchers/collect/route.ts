import { NextRequest, NextResponse } from 'next/server'
import { eos } from '@/lib/services/event-service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { voucherCodeOrRef, officerName } = body

    if (!voucherCodeOrRef) {
      return NextResponse.json({ error: 'Missing voucher code or order reference' }, { status: 400 })
    }

    const result = eos.collectMerchandiseVoucher(voucherCodeOrRef, officerName || 'Booth 4 Staff')

    if (result.status === 'invalid') {
      return NextResponse.json(result, { status: 404 })
    }

    if (result.status === 'duplicate_claim') {
      return NextResponse.json(result, { status: 409 }) // Conflict (Already collected!)
    }

    return NextResponse.json(result, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
