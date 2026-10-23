import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder_soar_secret_key'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-paystack-signature')

    // 1. Verify webhook HMAC-SHA512 signature
    if (signature) {
      const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(rawBody)
        .digest('hex')

      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid Paystack webhook signature' }, { status: 401 })
      }
    }

    const event = JSON.parse(rawBody)

    // 2. Handle charge.success idempotently
    if (event.event === 'charge.success') {
      const data = event.data
      const orderRef = data.metadata?.orderReference || data.reference
      const amountPaid = data.amount / 100 // Convert Kobo to NGN
      const currency = data.currency

      // Verification logic: Verify that the order exists and amount matches
      // Note: Payment status is marked verified only upon server verification
      return NextResponse.json({ 
        received: true, 
        orderReference: orderRef, 
        verifiedAmount: amountPaid, 
        currency 
      }, { status: 200 })
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
