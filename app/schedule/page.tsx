'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  CalendarDays, 
  Clock, 
  MapPin, 
  CalendarPlus, 
  Filter, 
  Sparkles, 
  Users, 
  Flame, 
  Layers,
  ArrowRight
} from 'lucide-react'
import { CONFERENCE_SCHEDULE } from '@/lib/conference-data'
import { downloadICSFile } from '@/lib/calendar'

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', 'Plenary', 'Worship & Encounter', 'Leadership Track', 'Campus Forum', 'Workshops']

  const daysMeta = [
    { day: 1, title: 'Arrival & Opening Plenary', date: 'Thursday, 10 Dec 2026' },
    { day: 2, title: 'Formation & Fellowship', date: 'Friday, 11 Dec 2026' },
    { day: 3, title: 'Commissioning & Impartation', date: 'Saturday, 12 Dec 2026' },
    { day: 4, title: 'Celebration & Sending Forth', date: 'Sunday, 13 Dec 2026' },
  ]

  const filteredSessions = CONFERENCE_SCHEDULE.filter(s => {
    const matchesDay = s.day === selectedDay
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory
    return matchesDay && matchesCat
  })

  return (
    <main className="min-h-screen bg-[#041d24] text-[#f4efe4] selection:bg-[#efbd3b] selection:text-[#062d31]">
      {/* Top Navbar */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#062d31]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition"
          >
            <ArrowLeft className="size-4" />
            <span>SOAR 2026 Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-black tracking-wider text-[#ffd66a]">
              Official 4-Day Conference Schedule
            </span>
          </div>
          <button
            onClick={() => downloadICSFile('SOAR-2026-Schedule.ics')}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#efbd3b] px-3.5 py-1.5 text-xs font-bold text-[#062d31] hover:bg-[#ffd66a] transition"
          >
            <CalendarPlus className="size-3.5" />
            <span className="hidden sm:inline">Add to Calendar</span>
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <div className="rounded-3xl border border-[#efbd3b]/30 bg-gradient-to-r from-[#062d31] via-[#0b3b3e] to-[#041d24] p-8 sm:p-12 mb-10 shadow-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#efbd3b]">
            10–13 December 2026 · MFM Prayer City
          </span>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black text-white tracking-tight">
            Conference <span className="font-serif font-normal italic text-[#ffd66a]">Rhythm.</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/75 max-w-2xl leading-relaxed">
            Daily sessions run from 9:00 AM to 5:00 PM. Each day combines apostolic preaching, intensive morning intercession, campus leadership forums, and creative ministry masterclasses.
          </p>
        </div>

        {/* Day Selector Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {daysMeta.map(d => (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                selectedDay === d.day
                  ? 'border-[#efbd3b] bg-[#0b3b3e] shadow-lg scale-[1.02]'
                  : 'border-white/10 bg-[#062d31]/60 text-white/60 hover:bg-[#062d31] hover:text-white'
              }`}
            >
              <span className={`font-mono text-xs font-bold uppercase tracking-wider block ${
                selectedDay === d.day ? 'text-[#efbd3b]' : 'text-white/40'
              }`}>
                Day 0{d.day} · {d.date.split(',')[0]}
              </span>
              <h3 className="text-sm font-bold text-white mt-1">{d.title}</h3>
              <p className="text-[11px] text-white/50 mt-0.5">{d.date.split(',')[1]}</p>
            </button>
          ))}
        </div>

        {/* Track / Category Filter */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-white/10 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-white/40 mr-2 flex items-center gap-1">
            <Filter className="size-3.5" />
            Track:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-[#efbd3b] text-[#062d31]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        <div className="space-y-5">
          {filteredSessions.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#062d31] p-12 text-center text-white/50">
              <p className="text-sm">No sessions match the selected track for this day.</p>
            </div>
          ) : (
            filteredSessions.map(session => (
              <div
                key={session.id}
                className={`rounded-3xl border p-6 sm:p-8 transition-all duration-300 ${
                  session.isHighlight
                    ? 'border-[#efbd3b]/60 bg-gradient-to-r from-[#0b3b3e] to-[#062d31] shadow-xl'
                    : 'border-white/10 bg-[#062d31]/70 hover:border-white/25'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="flex items-center gap-1.5 font-mono text-sm font-bold text-[#ffd66a]">
                      <Clock className="size-4 text-[#efbd3b]" />
                      {session.time}
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white/80">
                      {session.category}
                    </span>
                    {session.isHighlight && (
                      <span className="rounded-full bg-[#8d210f] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        Key Plenary
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1.5 text-xs text-white/60">
                    <MapPin className="size-3.5 text-[#efbd3b]" />
                    {session.venue}
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {session.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed max-w-3xl">
                    {session.description}
                  </p>

                  {session.ministers && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-white/40">Ministers / Facilitators:</span>
                      {session.ministers.map(m => (
                        <span key={m} className="rounded-md bg-[#041d24] border border-white/15 px-2.5 py-1 font-semibold text-[#ffd66a]">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
