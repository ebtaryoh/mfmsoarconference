'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  ShoppingBag, 
  CheckCircle2, 
  MapPin, 
  QrCode, 
  Download, 
  Share2, 
  Clock, 
  AlertCircle,
  PackageCheck
} from 'lucide-react'
import { getOrders } from '@/lib/storage'
import { MerchandiseOrder } from '@/lib/types'
import { QRCodeDisplay } from '@/components/qr-code'

export default function OrderVoucherPage() {
  const params = useParams()
  const orderRef = (params?.id as string) || ''
  const [order, setOrder] = useState<MerchandiseOrder | null>(null)

  useEffect(() => {
    if (orderRef) {
      const orders = getOrders()
      const found = orders.find(o => 
        o.orderReference.toLowerCase() === orderRef.toLowerCase() ||
        o.pickupCode.toLowerCase() === orderRef.toLowerCase()
      )
      if (found) {
        setOrder(found)
      } else {
        // Fallback demo order
        setOrder({
          id: 'temp',
          orderReference: orderRef,
          customerName: 'Conference Delegate',
          customerEmail: 'delegate@mfmyouth.org',
          customerPhone: '+234 803 000 0000',
          items: [
            {
              productId: 'prod-tee-01',
              productName: 'SOAR 2026 Signature Oversized Tee (L)',
              quantity: 1,
              unitPrice: 8500
            }
          ],
          totalAmount: 8500,
          currency: 'NGN',
          orderDate: new Date().toISOString(),
          paymentStatus: 'Paid Online',
          collectionStatus: 'pending',
          pickupCode: `VOUCH-${orderRef}`
        })
      }
    }
  }, [orderRef])

  const pickupCode = order?.pickupCode || `VOUCH-${orderRef}`

  function handleShare() {
    const text = encodeURIComponent(
      `🛍️ SOAR 2026 Merchandise Pickup Voucher\n` +
      `Order Ref: ${order?.orderReference}\n` +
      `Customer: ${order?.customerName}\n` +
      `Collection Point: Prayer City Youth Pavilion, Booth 4\n` +
      `Items: ${order?.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const isCollected = order?.collectionStatus === 'collected'

  return (
    <main className="min-h-screen bg-[#041d24] px-4 py-8 text-[#f4efe4] selection:bg-[#efbd3b] selection:text-[#062d31] sm:px-6 lg:px-8">
      <header className="mx-auto flex max-w-2xl items-center justify-between border-b border-white/10 pb-5">
        <Link 
          href="/store" 
          className="inline-flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Store</span>
        </Link>
        <span className="text-xs font-black uppercase tracking-wider text-[#ffd66a]">
          Merchandise Pickup Voucher
        </span>
      </header>

      <div className="mx-auto max-w-xl py-12 sm:py-16">
        <div className="text-center mb-8">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-[#062d31] border border-[#efbd3b]/40 text-[#efbd3b] shadow-xl">
            <ShoppingBag className="size-7" />
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white">
            Pre-Order <span className="font-serif font-normal italic text-[#ffd66a]">Voucher.</span>
          </h1>
          <p className="mt-1 text-xs text-white/60">
            Show this dedicated voucher QR at the collection desk to receive your packaged merchandise.
          </p>
        </div>

        {/* The Voucher Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#efbd3b]/40 bg-gradient-to-b from-[#0b3b3e] via-[#062d31] to-[#031d27] p-6 sm:p-8 shadow-2xl text-white">
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#efbd3b] tracking-wider">
                Official Pickup Voucher
              </span>
              <h3 className="text-xl font-mono font-black text-white mt-0.5">
                {order?.orderReference}
              </h3>
            </div>
            <span className={`rounded-full px-3 py-1 text-[10px] font-mono font-bold ${
              isCollected 
                ? 'bg-[#22c55e] text-[#062d31]' 
                : 'bg-[#efbd3b] text-[#062d31]'
            }`}>
              {isCollected ? 'COLLECTED' : 'READY FOR PICKUP'}
            </span>
          </div>

          <div className="mt-6">
            <span className="text-[10px] uppercase tracking-wider text-white/40">Purchased For</span>
            <p className="text-xl font-bold text-white mt-0.5">{order?.customerName}</p>
            <p className="text-xs text-white/60 font-mono">{order?.customerPhone} · {order?.customerEmail}</p>
          </div>

          {/* Items breakdown */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#041d24] p-4 space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-[#efbd3b] tracking-wider block mb-2">
              Reserved Items
            </span>
            {order?.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                <span className="text-white/80">{item.quantity}x {item.productName}</span>
                <span className="font-mono text-white/60">
                  {order.currency} {(item.unitPrice * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="pt-2 flex justify-between font-bold text-white">
              <span>Total:</span>
              <span className="font-mono text-[#ffd66a]">{order?.currency} {order?.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Dedicated Pickup QR */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-dashed border-[#efbd3b]/30 bg-[#041d24]/90 p-4">
            <div className="bg-white p-2 rounded-xl shrink-0">
              <QRCodeDisplay 
                value={pickupCode} 
                size={110} 
                fgColor="#062d31" 
                bgColor="#ffffff"
                label="" 
              />
            </div>
            <div className="text-center sm:text-left text-xs">
              <p className="font-bold text-[#ffd66a] flex items-center justify-center sm:justify-start gap-1">
                <PackageCheck className="size-4 text-[#22c55e]" />
                Merchandise Voucher Code
              </p>
              <p className="text-white/60 text-[11px] mt-1">
                Distinct from your conference admission ticket. Usher staff scan this at the booth to release order items.
              </p>
              <p className="mt-1.5 font-mono text-[10px] text-white/40">
                CODE: {pickupCode}
              </p>
            </div>
          </div>

          {/* Collection Instructions */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#062d31] p-4 text-xs text-white/70 space-y-2">
            <div className="flex items-start gap-2.5">
              <MapPin className="size-4 text-[#efbd3b] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Collection Desk Location:</strong>
                <p className="text-white/50 text-[11px]">Prayer City Youth Pavilion, Booth 4 (Open 8:30 AM – 5:30 PM daily)</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 py-3 text-xs font-bold text-white hover:border-[#25D366] hover:text-[#25D366] transition"
            >
              <Share2 className="size-3.5" />
              <span>Share Voucher</span>
            </button>
            <Link
              href="/store"
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#efbd3b] py-3 text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition"
            >
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
