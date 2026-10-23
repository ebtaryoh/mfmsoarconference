'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  Check, 
  ArrowRight, 
  Download, 
  Share2, 
  CalendarPlus, 
  Sparkles, 
  Ticket, 
  MapPin, 
  Clock, 
  Copy, 
  CheckCheck,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react'
import { getAttendeeByReference } from '@/lib/storage'
import { Attendee } from '@/lib/types'
import { QRCodeDisplay } from '@/components/qr-code'
import { downloadICSFile } from '@/lib/calendar'
import { CONFERENCE_INFO } from '@/lib/conference-data'

function SuccessContent() {
  const searchParams = useSearchParams()
  const codeParam = searchParams.get('code') || ''
  const [attendee, setAttendee] = useState<Attendee | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (codeParam) {
      const found = getAttendeeByReference(codeParam)
      if (found) {
        setAttendee(found)
      } else {
        // Fallback placeholder preview
        setAttendee({
          id: 'temp',
          reference: codeParam,
          fullName: 'Conference Delegate',
          email: 'delegate@mfmyouth.org',
          phone: '+234 800 000 0000',
          role: 'Young Person',
          category: 'Delegate',
          unitOrCampus: 'MFM Youth Ministry',
          stateOrRegion: 'Lagos State',
          registeredAt: new Date().toISOString(),
          checkInStatus: 'not_checked_in'
        })
      }
    }
  }, [codeParam])

  const reference = attendee?.reference || codeParam || 'SOAR-2026-CONFIRMED'
  const ticketUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/ticket/${reference}`
    : `https://soar2026.mfmyouth.org/ticket/${reference}`

  function copyPassLink() {
    navigator.clipboard.writeText(ticketUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function shareWhatsApp() {
    const message = encodeURIComponent(
      `🦅 I am attending SOAR 2026: Higher Together!\n\n` +
      `Dates: 10–13 December 2026\n` +
      `Venue: MFM Prayer City, KM 12 Lagos–Ibadan Expressway\n` +
      `Attendee: ${attendee?.fullName || 'Conference Delegate'}\n` +
      `Pass Reference: ${reference}\n\n` +
      `Register for free & claim your pass: ${ticketUrl}`
    )
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  return (
    <div className="mx-auto max-w-4xl py-10 sm:py-16">
      {/* Celebration Header */}
      <div className="text-center">
        <div className="inline-flex size-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#ffd66a] to-[#efbd3b] text-[#062d31] shadow-[0_0_40px_rgba(239,189,59,0.4)]">
          <Check className="size-8 stroke-[3]" />
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.32em] text-[#efbd3b]">
          Registration Confirmed · You Are In
        </p>
        <h1 className="mt-3 text-4xl sm:text-6xl font-black text-white tracking-tight">
          Welcome to <span className="font-serif font-normal italic text-[#ffd66a]">SOAR 2026.</span>
        </h1>
        <p className="mt-3 text-sm text-white/70 max-w-lg mx-auto">
          Your digital pass has been issued. Keep this reference handy for quick entry at MFM Prayer City gate turnstiles.
        </p>
      </div>

      {/* TICKET PASS CARD PREVIEW */}
      <div className="mt-12 grid gap-8 lg:grid-cols-12 items-start">
        {/* Pass Render (Cols 1-7) */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-3xl border border-[#efbd3b]/40 bg-gradient-to-b from-[#0b3b3e] via-[#062d31] to-[#031d27] p-6 sm:p-8 shadow-2xl text-white">
            {/* Watermark Crest */}
            <div className="absolute right-[-10%] top-[-10%] size-64 rounded-full border-[35px] border-[#efbd3b]/10 pointer-events-none" />

            {/* Top Pass Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#efbd3b]">
                  MFM Youth Ministry
                </span>
                <h3 className="text-2xl font-black tracking-tight mt-0.5">
                  SOAR <span className="text-[#ffd66a]">2026</span>
                </h3>
                <p className="text-xs text-white/60">Official Turnstile Admission Pass</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="rounded-full bg-[#22c55e]/20 border border-[#22c55e]/40 px-3 py-0.5 text-[10px] font-mono font-bold text-[#22c55e]">
                  CONFIRMED
                </span>
                <span className="text-[10px] text-white/40 mt-1 font-mono">ALL SESSIONS</span>
              </div>
            </div>

            {/* Attendee Details */}
            <div className="mt-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                Attendee Name
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                {attendee?.fullName || 'Conference Delegate'}
              </h2>
              <p className="text-xs text-[#ffd66a] font-semibold mt-1">
                {attendee?.role || 'Young Person'} · {attendee?.unitOrCampus || 'MFM Youth'}
              </p>
            </div>

            {/* Pass Metadata Row */}
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs">
              <div>
                <span className="text-white/40 text-[10px] uppercase tracking-wider">Pass Reference</span>
                <p className="font-mono font-bold text-white mt-0.5">{reference}</p>
              </div>
              <div>
                <span className="text-white/40 text-[10px] uppercase tracking-wider">Dates & Venue</span>
                <p className="font-bold text-white mt-0.5">10–13 Dec · Prayer City</p>
              </div>
            </div>

            {/* QR Code Segment */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-dashed border-white/20 bg-[#041d24]/80 p-4">
              <div className="bg-white p-2 rounded-xl shadow-md">
                <QRCodeDisplay 
                  value={reference} 
                  size={120} 
                  fgColor="#062d31" 
                  bgColor="#ffffff"
                  label=""
                />
              </div>
              <div className="text-center sm:text-left text-xs">
                <p className="font-bold text-[#ffd66a] flex items-center justify-center sm:justify-start gap-1">
                  <ShieldCheck className="size-4 text-[#22c55e]" />
                  Validated Turnstile QR Code
                </p>
                <p className="text-white/60 text-[11px] mt-1 leading-relaxed">
                  Present this QR code on your phone screen at Prayer City Gate 1, 2, or 4 for instantaneous admission.
                </p>
                <span className="mt-2 inline-block rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/70">
                  REF: {reference}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel (Cols 8-12) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-[#062d31] p-6 text-white space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#efbd3b]">
              Quick Pass Actions
            </h4>

            {/* View Full Wallet */}
            <Link
              href={`/ticket/${reference}`}
              className="w-full flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#ffd66a] to-[#efbd3b] p-4 text-xs font-black text-[#062d31] hover:brightness-110 transition shadow-md"
            >
              <div className="flex items-center gap-3">
                <Ticket className="size-5" />
                <div className="text-left">
                  <p className="text-sm font-black">Open Attendee Wallet</p>
                  <p className="text-[10px] opacity-75 font-normal">View live pass, voucher & announcements</p>
                </div>
              </div>
              <ArrowRight className="size-4" />
            </Link>

            {/* WhatsApp Share */}
            <button
              onClick={shareWhatsApp}
              className="w-full flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 p-4 text-xs font-bold text-white hover:bg-white/10 hover:border-[#25D366] transition"
            >
              <div className="flex items-center gap-3">
                <Share2 className="size-5 text-[#25D366]" />
                <div className="text-left">
                  <p className="text-sm font-bold">Share to WhatsApp</p>
                  <p className="text-[10px] text-white/50">Send ticket link to your WhatsApp or status</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-white/40" />
            </button>

            {/* Add to Calendar */}
            <button
              onClick={() => downloadICSFile(`SOAR-2026-${reference}.ics`)}
              className="w-full flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 p-4 text-xs font-bold text-white hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <CalendarPlus className="size-5 text-[#efbd3b]" />
                <div className="text-left">
                  <p className="text-sm font-bold">Add to Calendar (.ics)</p>
                  <p className="text-[10px] text-white/50">Compatible with Apple & Google Calendar</p>
                </div>
              </div>
              <Download className="size-4 text-white/40" />
            </button>

            {/* Create Poster CTA */}
            <Link
              href="/attend"
              className="w-full flex items-center justify-between rounded-2xl border border-[#efbd3b]/30 bg-[#8d210f]/40 p-4 text-xs font-bold text-white hover:bg-[#8d210f]/70 transition"
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="size-5 text-[#ffd66a]" />
                <div className="text-left">
                  <p className="text-sm font-bold">Create Attendance Poster</p>
                  <p className="text-[10px] text-white/60">Upload photo and get official DP flyer</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#ffd66a]" />
            </Link>

            {/* Copy Link helper */}
            <div className="pt-2">
              <button
                onClick={copyPassLink}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#041d24] py-3 text-xs font-medium text-white/70 hover:text-white"
              >
                {copied ? (
                  <>
                    <CheckCheck className="size-4 text-[#22c55e]" />
                    <span className="text-[#22c55e] font-bold">Pass Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    <span>Copy Permanent Pass URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegistrationSuccessPage() {
  return (
    <main className="min-h-screen bg-[#041d24] px-4 py-8 text-[#f4efe4] selection:bg-[#efbd3b] selection:text-[#062d31] sm:px-6 lg:px-8">
      {/* Top Header */}
      <header className="mx-auto flex max-w-4xl items-center justify-between border-b border-white/10 pb-5">
        <Link 
          href="/" 
          className="text-xs font-bold text-white/70 hover:text-white transition"
        >
          &larr; SOAR 2026 Home
        </Link>
        <span className="text-xs font-black tracking-wider text-[#ffd66a]">
          Registration Successful
        </span>
      </header>

      <Suspense fallback={<div className="text-center py-20 text-white/50">Loading ticket credentials...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  )
}
