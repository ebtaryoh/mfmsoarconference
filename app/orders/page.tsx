'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Search, ArrowRight, Package } from 'lucide-react'
import { getOrders } from '@/lib/storage'
import { MerchandiseOrder } from '@/lib/types'

export default function OrdersIndexPage() {
  const [orders, setOrders] = useState<MerchandiseOrder[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    setOrders(getOrders())
  }, [])

  const filtered = orders.filter(o => 
    o.orderReference.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.pickupCode.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-[#041d24] px-4 py-8 text-[#f4efe4] selection:bg-[#efbd3b] selection:text-[#062d31] sm:px-6 lg:px-8">
      <header className="mx-auto flex max-w-4xl items-center justify-between border-b border-white/10 pb-5">
        <Link 
          href="/store" 
          className="inline-flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Store</span>
        </Link>
        <span className="text-xs font-black uppercase tracking-wider text-[#ffd66a]">
          Merchandise Orders Directory
        </span>
      </header>

      <div className="mx-auto max-w-4xl py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              My Pre-Order <span className="font-serif font-normal italic text-[#ffd66a]">Vouchers.</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-white/60">
              Lookup your order or view active vouchers for pickup at Prayer City Youth Pavilion Booth 4.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 size-4 text-white/40" />
            <input
              type="text"
              placeholder="Search order ref or name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#062d31] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/30 focus:border-[#efbd3b] focus:outline-none"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#062d31] p-12 text-center text-white/60">
            <Package className="size-12 mx-auto opacity-50 mb-3 text-[#efbd3b]" />
            <p className="text-sm font-bold text-white">No pre-orders found</p>
            <p className="text-xs mt-1">Pre-order official tees, caps, and journals from the conference store.</p>
            <Link
              href="/store"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#efbd3b] px-6 py-2.5 text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition"
            >
              <span>Go to Store</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map(order => (
              <Link
                key={order.id}
                href={`/orders/${order.orderReference}`}
                className="group rounded-3xl border border-white/10 bg-[#062d31] p-6 text-white hover:border-[#efbd3b]/60 transition-all shadow-md hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#efbd3b]">
                    {order.orderReference}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold ${
                    order.collectionStatus === 'collected' ? 'bg-[#22c55e] text-[#062d31]' : 'bg-[#ffd66a] text-[#062d31]'
                  }`}>
                    {order.collectionStatus === 'collected' ? 'COLLECTED' : 'READY FOR PICKUP'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-4 group-hover:text-[#ffd66a] transition-colors">
                  {order.customerName}
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  {order.items.length} items reserved · {order.currency} {order.totalAmount.toLocaleString()}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-bold text-[#efbd3b]">
                  <span>View Pickup Voucher</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
