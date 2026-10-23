'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  DoorClosed, 
  DoorOpen, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Scan, 
  Volume2, 
  VolumeX, 
  Sparkles 
} from 'lucide-react'
import { checkInAttendee } from '@/lib/storage'
import { Attendee } from '@/lib/types'

export default function TurnstileKioskPage() {
  const [inputVal, setInputVal] = useState('')
  const [gate, setGate] = useState('Gate 1 — Main North')
  const [turnstileState, setTurnstileState] = useState<'locked' | 'passed' | 'denied'>('locked')
  const [activeAttendee, setActiveAttendee] = useState<Attendee | null>(null)
  const [statusText, setStatusText] = useState('HOLD PASS 4 INCHES FROM SCANNER')

  function handleScan(code: string) {
    if (!code.trim()) return

    const res = checkInAttendee(code.trim().toUpperCase(), gate, 'Automated Turnstile Kiosk')

    if (res.success && res.attendee) {
      setTurnstileState('passed')
      setActiveAttendee(res.attendee)
      setStatusText(`ACCESS GRANTED · WELCOME ${res.attendee.fullName.toUpperCase()}`)

      // Auto lock after 3.5 seconds
      setTimeout(() => {
        setTurnstileState('locked')
        setActiveAttendee(null)
        setStatusText('HOLD PASS 4 INCHES FROM SCANNER')
      }, 3500)
    } else {
      setTurnstileState('denied')
      setActiveAttendee(res.attendee || null)
      setStatusText(res.message.toUpperCase())

      setTimeout(() => {
        setTurnstileState('locked')
        setActiveAttendee(null)
        setStatusText('HOLD PASS 4 INCHES FROM SCANNER')
      }, 3500)
    }

    setInputVal('')
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-12 transition-colors duration-500 selection:bg-black selection:text-white ${
      turnstileState === 'passed' 
        ? 'bg-[#15803d] text-white' 
        : turnstileState === 'denied' 
        ? 'bg-[#b91c1c] text-white' 
        : 'bg-[#02141a] text-white'
    }`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/20 pb-4">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white/70 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          <span>Exit Turnstile Kiosk</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-black/30 border border-white/20">
            {gate}
          </span>
          <span className="flex size-3 rounded-full bg-[#22c55e] animate-ping" />
        </div>
      </div>

      {/* Centerpiece Visual Feedback */}
      <div className="max-w-2xl mx-auto w-full text-center py-10">
        <div className="inline-flex size-28 items-center justify-center rounded-3xl bg-black/40 border-4 border-white/30 shadow-2xl mb-8">
          {turnstileState === 'passed' ? (
            <DoorOpen className="size-16 text-[#ffd66a] animate-bounce" />
          ) : turnstileState === 'denied' ? (
            <XCircle className="size-16 text-white" />
          ) : (
            <DoorClosed className="size-16 text-[#efbd3b]" />
          )}
        </div>

        <p className="font-mono text-xs font-black uppercase tracking-[0.3em] opacity-70">
          MFM Prayer City Automated Gate System
        </p>

        <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          {turnstileState === 'passed' && 'PASSAGE OPEN'}
          {turnstileState === 'denied' && 'ACCESS BLOCKED'}
          {turnstileState === 'locked' && 'SCAN QR TO ENTER'}
        </h1>

        <p className="mt-4 font-mono text-sm sm:text-base font-bold tracking-wide uppercase px-4 py-2 rounded-xl bg-black/30 inline-block border border-white/10">
          {statusText}
        </p>

        {activeAttendee && (
          <div className="mt-8 p-6 rounded-2xl bg-black/50 border border-white/20 max-w-md mx-auto text-left space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#efbd3b]">Validated Credential</span>
            <p className="text-xl font-bold">{activeAttendee.fullName}</p>
            <p className="text-xs text-white/80">{activeAttendee.role} · {activeAttendee.unitOrCampus}</p>
          </div>
        )}
      </div>

      {/* Bottom Bar: Scanner Input & Quick Tap */}
      <div className="max-w-xl mx-auto w-full space-y-4">
        <form onSubmit={e => { e.preventDefault(); handleScan(inputVal); }} className="flex gap-2">
          <input
            type="text"
            placeholder="Turnstile 2D barcode scanner input..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            autoFocus
            className="flex-1 rounded-2xl border-2 border-white/30 bg-black/40 px-5 py-4 font-mono text-sm text-white placeholder:text-white/30 focus:border-[#efbd3b] focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-2xl bg-[#efbd3b] px-6 py-4 font-mono text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition"
          >
            SIMULATE TAP
          </button>
        </form>

        <div className="flex justify-center gap-2 text-[10px] font-mono text-white/50">
          <button onClick={() => handleScan('SOAR-2026-7842-AX')} className="hover:text-white underline">
            Tap Valid Pass (Emmanuel)
          </button>
          <span>·</span>
          <button onClick={() => handleScan('SOAR-2026-INVALID')} className="hover:text-white underline">
            Tap Invalid Pass
          </button>
        </div>
      </div>
    </div>
  )
}
