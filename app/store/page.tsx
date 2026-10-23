'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Clock, 
  MapPin, 
  X, 
  Plus, 
  Minus,
  ShieldCheck,
  Package
} from 'lucide-react'
import { MERCHANDISE_PRODUCTS } from '@/lib/conference-data'
import { MerchandiseProduct, OrderItem } from '@/lib/types'
import { saveOrder, getAttendeeByReference } from '@/lib/storage'

export default function StorePage() {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<MerchandiseProduct | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  // Cart state
  const [cart, setCart] = useState<OrderItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Checkout form
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [attendeeRef, setAttendeeRef] = useState('')
  const [checkoutError, setCheckoutError] = useState('')

  function openProductModal(prod: MerchandiseProduct) {
    setSelectedProduct(prod)
    setSelectedSize(prod.sizes?.[0] || 'Standard')
    setSelectedColor(prod.colors?.[0]?.name || 'Standard')
    setQuantity(1)
  }

  function addToCart() {
    if (!selectedProduct) return

    const item: OrderItem = {
      productId: selectedProduct.id,
      productName: `${selectedProduct.name} (${selectedColor} - ${selectedSize})`,
      variantColor: selectedColor,
      variantSize: selectedSize,
      quantity,
      unitPrice: selectedProduct.price
    }

    setCart(prev => [...prev, item])
    setSelectedProduct(null)
    setIsCartOpen(true)
  }

  function removeFromCart(index: number) {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)

  // Auto-fill customer details from registration reference if provided
  function handleRefLookup(ref: string) {
    setAttendeeRef(ref)
    if (ref.trim().length > 6) {
      const att = getAttendeeByReference(ref.trim())
      if (att) {
        setCustomerName(att.fullName)
        setCustomerEmail(att.email)
        setCustomerPhone(att.phone)
      }
    }
  }

  function handleCompleteCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setCheckoutError('Please provide your name, email, and phone number.')
      return
    }

    if (cart.length === 0) return

    const newOrder = saveOrder({
      attendeeReference: attendeeRef.trim() || undefined,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      items: cart,
      totalAmount: subtotal,
      currency: 'NGN',
      paymentStatus: 'Pay at Collection' // Supported safe default
    })

    // Reset and redirect to order voucher page
    setCart([])
    setIsCartOpen(false)
    setIsCheckingOut(false)
    router.push(`/orders/${newOrder.orderReference}`)
  }

  return (
    <main className="min-h-screen bg-[#041d24] text-[#f4efe4] selection:bg-[#efbd3b] selection:text-[#062d31]">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#062d31]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition"
          >
            <ArrowLeft className="size-4" />
            <span>SOAR 2026 Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider text-[#ffd66a]">
              Official Conference Store & Pre-Orders
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/orders"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white"
            >
              <span>My Orders & Vouchers</span>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 rounded-full bg-[#efbd3b] px-4 py-2 text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition"
              aria-label="Open cart"
            >
              <ShoppingBag className="size-4" />
              <span>Cart ({cart.length})</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-[#8d210f] text-[10px] font-bold text-white">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Banner */}
        <div className="rounded-3xl border border-[#efbd3b]/30 bg-gradient-to-r from-[#062d31] via-[#0b3b3e] to-[#041d24] p-8 sm:p-12 mb-14 shadow-2xl">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#efbd3b]">
              Official Commemorative Collection
            </span>
            <h1 className="mt-3 text-4xl sm:text-6xl font-black text-white tracking-tight">
              Wear the <span className="font-serif font-normal italic text-[#ffd66a]">Vision.</span>
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-white/75 leading-relaxed">
              Pre-order conference apparel and ministerial accessories for guaranteed collection at MFM Prayer City. Packaged and waiting for you at Booth 4, Youth Pavilion.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-[#efbd3b]" />
                Pre-order cutoff: 05 Dec 2026
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-[#efbd3b]" />
                Pickup: Prayer City Youth Pavilion, Booth 4
              </span>
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {MERCHANDISE_PRODUCTS.map(prod => (
            <div
              key={prod.id}
              className="group rounded-3xl border border-white/10 bg-[#062d31]/80 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#efbd3b]/50 hover:shadow-2xl hover:-translate-y-1"
            >
              <div>
                {/* Image Showcase */}
                <div className="relative aspect-[4/3] w-full bg-[#041d24] overflow-hidden">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-[#062d31]/90 border border-white/15 px-3 py-1 text-[10px] font-mono font-bold text-[#ffd66a] backdrop-blur-sm">
                    {prod.category}
                  </span>
                  <span className="absolute top-3 right-3 rounded-full bg-[#22c55e]/90 px-2.5 py-0.5 text-[10px] font-bold text-[#062d31]">
                    In Stock ({prod.stockCount})
                  </span>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-white group-hover:text-[#ffd66a] transition-colors">
                    {prod.name}
                  </h3>
                  <p className="mt-2 text-xs text-white/60 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                  <p className="mt-4 font-mono text-xl font-black text-[#ffd66a]">
                    {prod.currency} {prod.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => openProductModal(prod)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/15 py-3 text-xs font-bold text-white hover:bg-[#efbd3b] hover:text-[#062d31] transition"
                >
                  <span>Select Options & Pre-Order</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCT OPTIONS MODAL */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="relative w-full max-w-lg rounded-3xl border border-[#efbd3b]/40 bg-[#062d31] p-6 text-white shadow-2xl sm:p-8"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>

            <span className="text-[10px] font-mono uppercase text-[#efbd3b] tracking-wider">
              {selectedProduct.category}
            </span>
            <h2 className="mt-1 text-2xl font-black text-white">{selectedProduct.name}</h2>
            <p className="mt-2 text-xl font-mono font-bold text-[#ffd66a]">
              {selectedProduct.currency} {selectedProduct.price.toLocaleString()}
            </p>

            <p className="mt-4 text-xs text-white/70 leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Color variants */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div className="mt-5">
                <label className="text-xs font-bold text-white/80 block mb-2">Color Variant</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map(c => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        selectedColor === c.name
                          ? 'border-[#efbd3b] bg-[#0b3b3e] text-[#ffd66a]'
                          : 'border-white/15 bg-[#041d24] text-white/60 hover:text-white'
                      }`}
                    >
                      <span className="size-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size variants */}
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div className="mt-5">
                <label className="text-xs font-bold text-white/80 block mb-2">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`rounded-xl border px-4 py-2 text-xs font-bold transition ${
                        selectedSize === s
                          ? 'border-[#efbd3b] bg-[#efbd3b] text-[#062d31]'
                          : 'border-white/15 bg-[#041d24] text-white/60 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs font-bold text-white">Quantity</span>
              <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-[#041d24] px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:text-[#efbd3b]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="font-mono text-sm font-bold w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:text-[#efbd3b]"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Add to cart action */}
            <div className="mt-6 pt-2">
              <button
                type="button"
                onClick={addToCart}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffd66a] via-[#efbd3b] to-[#d49a1d] py-3.5 text-xs font-black text-[#062d31] hover:brightness-110 transition shadow-lg"
              >
                <ShoppingBag className="size-4" />
                <span>Add to Cart ({selectedProduct.currency} {(selectedProduct.price * quantity).toLocaleString()})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART & CHECKOUT DRAWER */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md animate-fade-in"
          onClick={() => setIsCartOpen(false)}
        >
          <div 
            className="w-full max-w-md h-full bg-[#062d31] border-l border-[#efbd3b]/30 p-6 flex flex-col justify-between overflow-y-auto text-white shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="size-5 text-[#efbd3b]" />
                  <h3 className="text-base font-black">Your Pre-Order Bag</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10"
                  aria-label="Close cart"
                >
                  <X className="size-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center text-white/50">
                  <Package className="size-12 mx-auto opacity-50 mb-3" />
                  <p className="text-sm">Your pre-order cart is empty.</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between rounded-2xl bg-[#041d24] p-4 border border-white/10">
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.productName}</h4>
                        <p className="text-xs text-white/50 font-mono mt-1">
                          {item.quantity} x NGN {item.unitPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono font-bold text-[#ffd66a]">
                          NGN {(item.unitPrice * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-[10px] text-red-400 hover:underline mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkout Area */}
            {cart.length > 0 && (
              <div className="border-t border-white/10 pt-6 mt-6">
                <div className="flex justify-between text-sm font-bold mb-4">
                  <span>Pre-order Total:</span>
                  <span className="font-mono text-[#ffd66a]">NGN {subtotal.toLocaleString()}</span>
                </div>

                {!isCheckingOut ? (
                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#efbd3b] py-3.5 text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition"
                  >
                    <span>Proceed to Pickup Credentials</span>
                    <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <form onSubmit={handleCompleteCheckout} className="space-y-3">
                    <p className="text-xs font-bold text-[#ffd66a]">Delegate Pickup Information</p>
                    
                    {checkoutError && (
                      <p className="text-[11px] text-red-300 bg-red-950/40 p-2 rounded">{checkoutError}</p>
                    )}

                    <input
                      type="text"
                      placeholder="Attendee Reference (Optional, e.g. SOAR-2026-...)"
                      value={attendeeRef}
                      onChange={e => handleRefLookup(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#041d24] p-2.5 text-xs text-white placeholder:text-white/30"
                    />

                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#041d24] p-2.5 text-xs text-white placeholder:text-white/30"
                    />

                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#041d24] p-2.5 text-xs text-white placeholder:text-white/30"
                    />

                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp Phone Number *"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#041d24] p-2.5 text-xs text-white placeholder:text-white/30"
                    />

                    <div className="rounded-xl bg-[#041d24]/60 p-2.5 text-[10px] text-white/50 leading-relaxed">
                      Pre-orders are collected at <strong>Prayer City Youth Pavilion (Booth 4)</strong>. A unique Pickup Voucher QR will be generated for collection desk scanning.
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffd66a] via-[#efbd3b] to-[#d49a1d] py-3.5 text-xs font-black text-[#062d31] hover:brightness-110 transition shadow-lg"
                    >
                      <span>Generate Pickup Voucher</span>
                      <Check className="size-4" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
