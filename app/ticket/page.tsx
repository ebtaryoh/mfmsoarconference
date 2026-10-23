'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Ticket, ArrowRight, ShieldCheck } from 'lucide-react'
import { getAttendeeByReference } from '@/lib/storage'

export default function TicketLookupPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    const found = getAttendeeByReference(query.trim())
    if (found) {
      router.push(`/ticket/${encodeURIComponent(found.reference)}`)
    } else {
      // If code looks like a reference, redirect anyway to let preview display
      if (query.trim().toUpperCase().startsWith('SOAR-2026')) {
        router.push(`/ticket/${encodeURIComponent(query.trim().toUpperCase())}`)
      } else {
        setError('No registration found matching that reference or email. Please check your spelling or register.')
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#041d24] px-4 py-8 text-[#f4efe4] selection:bg-[#efbd3b] selection:text-[#062d31] sm:px-6 lg:px-8">
      <header className="mx-auto flex max-w-2xl items-center justify-between border-b border-white/10 pb-5">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition"
        >
          <ArrowLeft className="size-4" />
          <span>Back to SOAR 2026 Home</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-[#ffd66a]">
          Pass Lookup
        </span>
      </header>

      <div className="mx-auto max-w-md py-16 sm:py-24 text-center">
        <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-[#062d31] border border-[#efbd3b]/40 text-[#efbd3b] shadow-xl">
          <Ticket className="size-7" />
        </div>

        <h1 className="mt-6 text-3xl sm:text-4xl font-black text-white">
          Find Your <span className="font-serif font-normal italic text-[#ffd66a]">Pass.</span>
        </h1>
        <p className="mt-2 text-xs text-white/60">
          Enter your registration reference (e.g. <span className="font-mono text-[#ffd66a]">SOAR-2026-7842-AX</span>), registered email, or phone number.
        </p>

        <form onSubmit={handleLookup} className="mt-8 space-y-4 text-left">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 size-4 text-white/40" />
            <input
              type="text"
              required
              placeholder="e.g. SOAR-2026-... or you@domain.com"
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setError('')
              }}
              className="w-full rounded-2xl border border-white/15 bg-[#062d31] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/25 focus:border-[#efbd3b] focus:outline-none focus:ring-1 focus:ring-[#efbd3b]"
            />
          </div>

          {error && (
            <p className="text-xs text-red-300 bg-red-950/40 p-3 rounded-xl border border-red-500/30">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffd66a] via-[#efbd3b] to-[#d49a1d] py-3.5 text-xs font-black text-[#062d31] shadow-lg hover:brightness-110 transition active:scale-98"
          >
            <span>Retrieve Digital Pass</span>
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="mt-12 rounded-2xl border border-white/10 bg-[#062d31]/50 p-5 text-xs text-white/60">
          <p className="font-bold text-white mb-1">Haven&apos;t registered yet?</p>
          <p className="mb-4">Free registration takes under 2 minutes and generates your turnstile QR code instantly.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 font-bold text-[#efbd3b] hover:underline"
          >
            <span>Register for SOAR 2026 Now &rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
