'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ShoppingBag, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Package, 
  Check, 
  X, 
  QrCode,
  Clock
} from 'lucide-react'
import { getOrders, collectOrder } from '@/lib/storage'
import { MerchandiseOrder } from '@/lib/types'

export default function MerchandiseDeskManagerPage() {
  const [orders, setOrders] = useState<MerchandiseOrder[]>([])
  const [search, setSearch] = useState('')
  const [scanCode, setScanCode] = useState('')
  const [deskFeedback, setDeskFeedback] = useState<{ status: 'success' | 'warning' | 'error'; message: string } | null>(null)

  function load() {
    setOrders(getOrders())
  }

  useEffect(() => {
    load()
    window.addEventListener('soar_orders_updated', load)
    return () => window.removeEventListener('soar_orders_updated', load)
  }, [])

  function handleVoucherScan(e: React.FormEvent) {
    e.preventDefault()
    if (!scanCode.trim()) return

    const res = collectOrder(scanCode.trim().toUpperCase(), 'Booth 4 Desk Lead')
    if (res.success) {
      setDeskFeedback({ status: 'success', message: res.message })
    } else {
      setDeskFeedback({ status: 'warning', message: res.message })
    }
    setScanCode('')
  }

  function handleCollectDirect(pickupCode: string) {
    const res = collectOrder(pickupCode, 'Booth 4 Direct Tap')
    if (res.success) {
      setDeskFeedback({ status: 'success', message: res.message })
    } else {
      setDeskFeedback({ status: 'warning', message: res.message })
    }
  }

  const filtered = orders.filter(o => 
    o.orderReference.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.pickupCode.toLowerCase().includes(search.toLowerCase())
  )

  const pendingCount = orders.filter(o => o.collectionStatus === 'pending').length
  const collectedCount = orders.filter(o => o.collectionStatus === 'collected').length

  return (
    <div className="p-5 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-xs font-mono font-bold text-[#efbd3b] uppercase">Booth 4 Operations</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Merchandise Collection Desk</h1>
          <p className="text-xs text-white/60">
            Verify pickup vouchers, inspect ordered sizes, and prevent duplicate collections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#062d31] border border-white/10 px-4 py-2 text-xs">
            <span className="text-white/50">Pending: </span>
            <strong className="text-[#ffd66a] font-mono">{pendingCount}</strong>
            <span className="text-white/50 ml-3">Collected: </span>
            <strong className="text-[#22c55e] font-mono">{collectedCount}</strong>
          </div>
        </div>
      </div>

      {deskFeedback && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold animate-rise ${
          deskFeedback.status === 'success' 
            ? 'border-[#22c55e] bg-[#22c55e]/15 text-[#22c55e]' 
            : 'border-[#eab308] bg-[#eab308]/15 text-[#fde047]'
        }`}>
          <div className="flex items-center gap-2">
            {deskFeedback.status === 'success' ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
            <span>{deskFeedback.message}</span>
          </div>
          <button onClick={() => setDeskFeedback(null)}><X className="size-4" /></button>
        </div>
      )}

      {/* Voucher Barcode Input Bar */}
      <div className="rounded-3xl border border-[#efbd3b]/30 bg-[#062d31] p-6 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#efbd3b] mb-3">
          Scan / Verify Pickup Voucher
        </h3>
        <form onSubmit={handleVoucherScan} className="flex gap-2">
          <div className="relative flex-1">
            <QrCode className="absolute left-4 top-3.5 size-4 text-white/40" />
            <input
              type="text"
              placeholder="Scan voucher barcode or enter pickup code (e.g. VOUCH-SOAR-... or ORD-SOAR-...)"
              value={scanCode}
              onChange={e => setScanCode(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-[#041d24] py-3.5 pl-11 pr-4 font-mono text-xs text-white placeholder:text-white/30 focus:border-[#efbd3b] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-[#efbd3b] px-6 py-3.5 text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition"
          >
            Verify Voucher
          </button>
        </form>
      </div>

      {/* Orders Registry Table */}
      <div className="rounded-3xl border border-white/10 bg-[#062d31] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Package className="size-4 text-[#efbd3b]" />
            Pre-Order Packages
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Filter by name or code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#041d24] py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="pb-3 font-semibold">Order / Voucher</th>
                <th className="pb-3 font-semibold">Delegate Info</th>
                <th className="pb-3 font-semibold">Reserved Items</th>
                <th className="pb-3 font-semibold">Total Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-mono font-bold text-[#ffd66a]">
                    {order.orderReference}
                    <span className="block text-[10px] text-white/40">{order.pickupCode}</span>
                  </td>
                  <td className="py-3 text-white">
                    <strong className="block">{order.customerName}</strong>
                    <span className="text-[10px] text-white/50">{order.customerPhone}</span>
                  </td>
                  <td className="py-3 text-white/80">
                    {order.items.map((it, idx) => (
                      <span key={idx} className="block text-[11px]">
                        {it.quantity}x {it.productName}
                      </span>
                    ))}
                  </td>
                  <td className="py-3 font-mono text-white/70">
                    {order.currency} {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold ${
                      order.collectionStatus === 'collected' 
                        ? 'bg-[#22c55e]/20 text-[#22c55e]' 
                        : 'bg-[#efbd3b]/20 text-[#ffd66a]'
                    }`}>
                      {order.collectionStatus === 'collected' ? 'Collected' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {order.collectionStatus === 'pending' ? (
                      <button
                        onClick={() => handleCollectDirect(order.pickupCode)}
                        className="rounded-lg bg-[#efbd3b] px-3 py-1.5 text-[11px] font-black text-[#062d31] hover:bg-[#ffd66a] transition"
                      >
                        Mark Collected
                      </button>
                    ) : (
                      <span className="text-[10px] text-white/40 italic">
                        Released ({order.collectedBy || 'Desk'})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
