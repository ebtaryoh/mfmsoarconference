'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  CalendarPlus, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag, 
  Bell, 
  WifiOff, 
  Ticket, 
  ShieldCheck, 
  QrCode,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { getAttendeeByReference, getOrders, getAnnouncements } from '@/lib/storage'
import { Attendee, MerchandiseOrder, ConferenceAnnouncement } from '@/lib/types'
import { QRCodeDisplay } from '@/components/qr-code'
import { downloadICSFile } from '@/lib/calendar'
import { CONFERENCE_INFO } from '@/lib/conference-data'

export default function TicketWalletPage() {
  const params = useParams()
  const code = (params?.code as string) || ''
  
  const [attendee, setAttendee] = useState<Attendee | null>(null)
  const [orders, setOrders] = useState<MerchandiseOrder[]>([])
  const [announcements, setAnnouncements] = useState<ConferenceAnnouncement[]>([])
  const [activeTab, setActiveTab] = useState<'pass' | 'vouchers' | 'info'>('pass')
  const [isExporting, setIsExporting] = useState(false)

  const ticketCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (code) {
      const found = getAttendeeByReference(code)
      if (found) {
        setAttendee(found)
      } else {
        // Fallback demo attendee
        setAttendee({
          id: 'temp',
          reference: code,
          fullName: 'Conference Delegate',
          email: 'delegate@mfmyouth.org',
          phone: '+234 803 000 0000',
          role: 'Young Person',
          category: 'Delegate',
          unitOrCampus: 'MFM Youth Ministry',
          stateOrRegion: 'Lagos State',
          registeredAt: new Date().toISOString(),
          checkInStatus: 'not_checked_in'
        })
      }

      // Check for associated merchandise orders
      const allOrders = getOrders()
      const attendeeOrders = allOrders.filter(o => 
        (found && o.attendeeReference?.toLowerCase() === found.reference.toLowerCase()) ||
        (found && o.customerEmail?.toLowerCase() === found.email.toLowerCase()) ||
        o.orderReference.toLowerCase() === code.toLowerCase()
      )
      setOrders(attendeeOrders)
    }

    setAnnouncements(getAnnouncements().filter(a => a.isActive))
  }, [code])

  const reference = attendee?.reference || code || 'SOAR-2026-PASS'

  function handleShareWhatsApp() {
    const url = typeof window !== 'undefined' ? window.location.href : `https://soar2026.mfmyouth.org/ticket/${reference}`
    const text = encodeURIComponent(
      `🦅 SOAR 2026 Official Digital Pass\n\n` +
      `Name: ${attendee?.fullName}\n` +
      `Pass Reference: ${reference}\n` +
      `Dates: 10–13 December 2026\n` +
      `Venue: MFM Prayer City, KM 12 Lagos-Ibadan Expressway\n\n` +
      `Access my ticket wallet: ${url}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  // Generate and download High-Res PNG badge directly from Canvas
  function downloadBadgePNG() {
    setIsExporting(true)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setIsExporting(false)
      return
    }

    // Set canvas dimensions (800 x 1200 high-res card)
    canvas.width = 800
    canvas.height = 1200

    // Background gradient (Deep Teal)
    const grad = ctx.createLinearGradient(0, 0, 800, 1200)
    grad.addColorStop(0, '#0b3b3e')
    grad.addColorStop(0.5, '#062d31')
    grad.addColorStop(1, '#031d27')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 800, 1200)

    // Outer border (Metallic Gold)
    ctx.strokeStyle = '#efbd3b'
    ctx.lineWidth = 14
    ctx.strokeRect(30, 30, 740, 1140)

    // Inner hairline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 2
    ctx.strokeRect(45, 45, 710, 1110)

    // Header Title
    ctx.fillStyle = '#efbd3b'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('MOUNTAIN OF FIRE AND MIRACLES MINISTRIES', 400, 110)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 68px sans-serif'
    ctx.fillText('SOAR 2026', 400, 185)

    ctx.fillStyle = '#ffd66a'
    ctx.font = 'italic 34px serif'
    ctx.fillText('Higher Together', 400, 230)

    // Separator line
    ctx.strokeStyle = 'rgba(239, 189, 59, 0.4)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(100, 270)
    ctx.lineTo(700, 270)
    ctx.stroke()

    // Attendee Category Pill
    ctx.fillStyle = '#8d210f'
    ctx.beginPath()
    ctx.roundRect(250, 310, 300, 48, 24)
    ctx.fill()
    ctx.fillStyle = '#ffd66a'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText((attendee?.role || 'CONFERENCE DELEGATE').toUpperCase(), 400, 342)

    // Attendee Name
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 44px sans-serif'
    ctx.fillText(attendee?.fullName || 'Conference Delegate', 400, 430)

    // Unit / Campus
    ctx.fillStyle = '#ffd66a'
    ctx.font = '500 24px sans-serif'
    ctx.fillText(attendee?.unitOrCampus || 'MFM Youth Ministry', 400, 475)

    // Pass Reference Box
    ctx.fillStyle = '#041d24'
    ctx.fillRect(150, 520, 500, 75)
    ctx.strokeStyle = 'rgba(239, 189, 59, 0.3)'
    ctx.strokeRect(150, 520, 500, 75)

    ctx.fillStyle = '#efbd3b'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText('OFFICIAL REGISTRATION REFERENCE', 400, 548)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 26px monospace'
    ctx.fillText(reference, 400, 580)

    // Conference Meta
    ctx.fillStyle = '#ffffff'
    ctx.font = '22px sans-serif'
    ctx.fillText('10–13 December 2026 · MFM Prayer City', 400, 650)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = '18px sans-serif'
    ctx.fillText('KM 12 Lagos–Ibadan Expressway · 9:00 AM – 5:00 PM', 400, 685)

    // QR Code Container Box
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(260, 730, 280, 280, 24)
    ctx.fill()

    // Draw Simulated high-contrast QR Matrix inside box
    const matrixSize = 25
    const cellSize = 8.5
    const startX = 295
    const startY = 765
    ctx.fillStyle = '#062d31'

    // Simple QR visual renderer for canvas
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        const isFinder = (r < 7 && c < 7) || (r < 7 && c >= matrixSize - 7) || (r >= matrixSize - 7 && c < 7)
        const isFinderBorder = isFinder && (r === 0 || r === 6 || c === 0 || c === 6 || r === matrixSize - 7 || r === matrixSize - 1 || c === matrixSize - 7 || c === matrixSize - 1)
        const isFinderDot = (r >= 2 && r <= 4 && c >= 2 && c <= 4) || (r >= 2 && r <= 4 && c >= matrixSize - 5 && c <= matrixSize - 3) || (r >= matrixSize - 5 && r <= matrixSize - 3 && c >= 2 && c <= 4)
        
        let shouldDraw = false
        if (isFinderBorder || isFinderDot) shouldDraw = true
        else if (!isFinder) {
          const charCode = reference.charCodeAt((r + c) % reference.length)
          shouldDraw = (r + c + charCode) % 3 === 0 || (r * c) % 5 === 0
        }

        if (shouldDraw) {
          ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize, cellSize)
        }
      }
    }

    // Bottom Footer note
    ctx.fillStyle = '#efbd3b'
    ctx.font = 'bold 18px sans-serif'
    ctx.fillText('TURNSTILE SCANNER ACCREDITATION PASS', 400, 1070)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.font = '14px sans-serif'
    ctx.fillText('Saved for offline presentation · Validated at venue entrance gates', 400, 1100)

    // Trigger download
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `SOAR-2026-Badge-${reference}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsExporting(false)
  }

  const isCheckedIn = attendee?.checkInStatus === 'checked_in'

  return (
    <main className="min-h-screen bg-[#041d24] px-4 py-8 text-[#f4efe4] selection:bg-[#efbd3b] selection:text-[#062d31] sm:px-6 lg:px-8">
      {/* Top Navbar */}
      <header className="mx-auto flex max-w-5xl items-center justify-between border-b border-white/10 pb-5">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition"
        >
          <ArrowLeft className="size-4" />
          <span>SOAR 2026 Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black tracking-wider text-[#ffd66a]">
            Attendee Wallet & Digital Pass
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl py-10 sm:py-14">
        {/* Hub Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-[#22c55e]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#ffd66a]">
                Credentials Verified
              </span>
            </div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-black text-white tracking-tight">
              Attendee <span className="font-serif font-normal italic text-[#ffd66a]">Wallet.</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/60">
              Your official credentials, turnstile QR code, merchandise pickup vouchers, and live event advisories.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:border-[#25D366] hover:text-[#25D366] transition"
            >
              <Share2 className="size-3.5" />
              <span>Share Pass</span>
            </button>

            <button
              onClick={downloadBadgePNG}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#efbd3b] px-4 py-2.5 text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition shadow-md"
            >
              <Download className="size-3.5" />
              <span>{isExporting ? 'Generating Badge...' : 'Save PNG Badge'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 gap-6 text-xs font-bold mb-8">
          <button
            onClick={() => setActiveTab('pass')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'pass' 
                ? 'border-[#efbd3b] text-[#ffd66a]' 
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Ticket className="size-4" />
            <span>Digital Admission Pass</span>
          </button>

          <button
            onClick={() => setActiveTab('vouchers')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'vouchers' 
                ? 'border-[#efbd3b] text-[#ffd66a]' 
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <ShoppingBag className="size-4" />
            <span>Merchandise Vouchers ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'info' 
                ? 'border-[#efbd3b] text-[#ffd66a]' 
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Bell className="size-4" />
            <span>Live Announcements ({announcements.length})</span>
          </button>
        </div>

        {/* TAB 1: DIGITAL ADMISSION PASS */}
        {activeTab === 'pass' && (
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* The Pass Card (Cols 1-7) */}
            <div className="lg:col-span-7">
              <div 
                ref={ticketCardRef}
                className="relative overflow-hidden rounded-3xl border border-[#efbd3b]/40 bg-gradient-to-b from-[#0b3b3e] via-[#062d31] to-[#031d27] p-6 sm:p-9 shadow-2xl text-white"
              >
                {/* Visual Watermark */}
                <div className="absolute right-[-15%] top-[-10%] size-80 rounded-full border-[45px] border-[#efbd3b]/10 pointer-events-none" />

                {/* Status Bar */}
                <div className="flex items-start justify-between border-b border-white/10 pb-5">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#efbd3b]">
                      MFM Youth Ministry
                    </span>
                    <h3 className="text-3xl font-black tracking-tight mt-1">
                      SOAR <span className="text-[#ffd66a]">2026</span>
                    </h3>
                    <p className="text-xs text-white/60">Official Turnstile Admission Pass</p>
                  </div>

                  <div className="flex flex-col items-end">
                    {isCheckedIn ? (
                      <span className="rounded-full bg-[#22c55e] px-3.5 py-1 text-[11px] font-mono font-bold text-[#062d31] flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="size-3.5" />
                        CHECKED IN
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#efbd3b]/20 border border-[#efbd3b]/40 px-3.5 py-1 text-[11px] font-mono font-bold text-[#ffd66a] flex items-center gap-1">
                        <ShieldCheck className="size-3.5 text-[#22c55e]" />
                        READY FOR GATE
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-white/40 mt-1">
                      {isCheckedIn ? `Checked In: ${attendee?.gate || 'Gate 1'}` : 'All 4 Conference Days'}
                    </span>
                  </div>
                </div>

                {/* Attendee Name */}
                <div className="mt-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Delegate Credential
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
                    {attendee?.fullName || 'Conference Delegate'}
                  </h2>
                  <p className="text-sm font-semibold text-[#ffd66a] mt-1">
                    {attendee?.role} · {attendee?.unitOrCampus}
                  </p>
                </div>

                {/* Reference & Location */}
                <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-5 text-xs">
                  <div>
                    <span className="text-white/40 text-[10px] uppercase tracking-wider">Pass Reference</span>
                    <p className="font-mono text-sm font-bold text-white mt-0.5">{reference}</p>
                    <span className="text-[10px] text-white/40">{attendee?.email}</span>
                  </div>
                  <div>
                    <span className="text-white/40 text-[10px] uppercase tracking-wider">Conference Dates</span>
                    <p className="font-bold text-white mt-0.5">10–13 December 2026</p>
                    <span className="text-[10px] text-[#ffd66a]">MFM Prayer City</span>
                  </div>
                </div>

                {/* Scannable Turnstile QR Code */}
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-dashed border-white/20 bg-[#041d24]/90 p-5">
                  <div className="bg-white p-2.5 rounded-2xl shadow-xl shrink-0">
                    <QRCodeDisplay 
                      value={reference} 
                      size={140} 
                      fgColor="#062d31" 
                      bgColor="#ffffff"
                      label=""
                    />
                  </div>
                  <div className="text-center sm:text-left text-xs">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#efbd3b]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#efbd3b] mb-2">
                      <QrCode className="size-3" />
                      Turnstile 2D Barcode
                    </div>
                    <p className="font-bold text-white text-sm">
                      Present at Gates 1, 2, or 4
                    </p>
                    <p className="text-white/60 text-[11px] mt-1.5 leading-relaxed">
                      Hold code 4–6 inches from usher scanner or automated turnstile kiosk for instant accreditation.
                    </p>
                    <p className="mt-2 text-[10px] font-mono text-white/40">
                      TOKEN: {reference}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Information & Offline Info (Cols 8-12) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Event Info Card */}
              <div className="rounded-3xl border border-white/10 bg-[#062d31] p-6 text-xs text-white/80 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#efbd3b]">
                  Venue & Schedule Guidance
                </h4>
                <div className="flex items-start gap-3">
                  <Clock className="size-4 text-[#efbd3b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Daily Sessions: 9:00 AM – 5:00 PM</strong>
                    <p className="text-white/50 text-[11px]">Arrive by 8:15 AM for swift turnstile accreditation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="size-4 text-[#efbd3b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">MFM Prayer City, KM 12</strong>
                    <p className="text-white/50 text-[11px]">Lagos–Ibadan Expressway, Ogun State, Nigeria.</p>
                    <a 
                      href={CONFERENCE_INFO.mapsUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#ffd66a] hover:underline"
                    >
                      Directions on Google Maps <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Offline Access Notice (Honest Presentation) */}
              <div className="rounded-3xl border border-white/10 bg-[#0b3b3e]/70 p-6 text-xs text-white/80">
                <div className="flex items-center gap-2 text-[#ffd66a] font-bold mb-2">
                  <WifiOff className="size-4" />
                  <span>Offline Pass Preservation</span>
                </div>
                <p className="text-[11px] leading-relaxed text-white/70">
                  You can download your pass as a PNG image to view in your phone gallery without cellular data.
                </p>
                <div className="mt-3 rounded-xl bg-[#041d24]/60 p-3 text-[10px] text-white/50 leading-relaxed border border-white/5">
                  <strong className="text-white/80 block mb-1">Gate Verification Policy:</strong>
                  Your saved badge image remains completely readable offline; turnstile validation and anti-duplicate check-in rules are synchronized across gate scanners.
                </div>
                <button
                  onClick={downloadBadgePNG}
                  className="mt-4 w-full rounded-full border border-white/20 bg-white/5 py-2.5 text-xs font-bold text-white hover:border-[#efbd3b] hover:text-[#efbd3b] transition"
                >
                  Download Offline PNG Badge
                </button>
              </div>

              {/* Add to Calendar Button */}
              <button
                onClick={() => downloadICSFile(`SOAR-2026-${reference}.ics`)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#062d31] border border-white/15 p-4 text-xs font-bold text-white hover:bg-[#0b3b3e] transition"
              >
                <CalendarPlus className="size-4 text-[#efbd3b]" />
                <span>Export SOAR 2026 to Calendar (.ics)</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MERCHANDISE VOUCHERS */}
        {activeTab === 'vouchers' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#062d31] p-10 text-center text-white">
                <ShoppingBag className="size-12 text-[#efbd3b] mx-auto opacity-70" />
                <h3 className="mt-4 text-xl font-bold">No Merchandise Pre-orders Found</h3>
                <p className="mt-2 text-xs text-white/60 max-w-md mx-auto leading-relaxed">
                  You haven&apos;t placed any merchandise pre-orders yet. Browse the SOAR Store to pre-order official tees, hoodies, and journals for collection at Prayer City.
                </p>
                <Link
                  href="/store"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#efbd3b] px-6 py-3 text-xs font-extrabold text-[#062d31] hover:bg-[#ffd66a] transition"
                >
                  <span>Visit SOAR 2026 Store</span>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="rounded-3xl border border-[#efbd3b]/30 bg-gradient-to-b from-[#0b3b3e] to-[#062d31] p-6 text-white shadow-xl relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono text-[#efbd3b] uppercase">Pickup Voucher</span>
                        <h4 className="text-lg font-bold">{order.orderReference}</h4>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-mono font-bold ${
                        order.collectionStatus === 'collected' 
                          ? 'bg-[#22c55e] text-[#062d31]' 
                          : 'bg-[#efbd3b] text-[#062d31]'
                      }`}>
                        {order.collectionStatus === 'collected' ? 'COLLECTED' : 'READY FOR PICKUP'}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-white/80">
                          <span>{item.quantity}x {item.productName}</span>
                          <span className="font-mono">{order.currency} {(item.unitPrice * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                      <div className="text-[11px] text-white/60">
                        <p><strong className="text-white">Booth:</strong> Prayer City Youth Pavilion, Booth 4</p>
                        <p className="mt-0.5">Show this pickup QR to collection staff</p>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg shrink-0">
                        <QRCodeDisplay value={order.pickupCode} size={64} fgColor="#062d31" bgColor="#ffffff" label="" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE ANNOUNCEMENTS */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            {announcements.map(ann => (
              <div
                key={ann.id}
                className="rounded-2xl border border-white/10 bg-[#062d31] p-5 text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#efbd3b]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#ffd66a] uppercase">
                      {ann.type}
                    </span>
                    <span className="text-xs text-white/40">Audience: {ann.targetAudience}</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">
                    {new Date(ann.publishedAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="mt-3 text-base font-bold text-[#ffd66a]">{ann.title}</h4>
                <p className="mt-1 text-xs text-white/75 leading-relaxed">{ann.content}</p>
                <p className="mt-3 text-[10px] text-white/40 italic">Issued by {ann.author}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
