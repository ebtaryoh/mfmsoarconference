'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Plus, Edit2, Trash2, Check, ArrowLeft } from 'lucide-react'
import { CONFERENCE_SCHEDULE } from '@/lib/conference-data'
import { ConferenceSession } from '@/lib/types'

export default function ScheduleManagerPage() {
  const [sessions, setSessions] = useState<ConferenceSession[]>(CONFERENCE_SCHEDULE)
  const [dayFilter, setDayFilter] = useState(1)
  const [newTitle, setNewTitle] = useState('')
  const [newTime, setNewTime] = useState('09:00 AM – 11:00 AM')
  const [newVenue, setNewVenue] = useState('Main Youth Auditorium')
  const [newCategory, setNewCategory] = useState<'Plenary' | 'Worship & Encounter' | 'Leadership Track' | 'Campus Forum' | 'Workshops'>('Plenary')
  const [newDesc, setNewDesc] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  function handleAddSession(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newSess: ConferenceSession = {
      id: `sess-${Date.now()}`,
      day: dayFilter,
      date: `Day ${dayFilter} (10–13 Dec 2026)`,
      time: newTime,
      startTime: '09:00',
      endTime: '11:00',
      title: newTitle.trim(),
      category: newCategory,
      venue: newVenue.trim(),
      description: newDesc.trim() || 'Session description curated by conference organizers.',
      isHighlight: newCategory === 'Plenary'
    }

    setSessions([newSess, ...sessions])
    setNewTitle('')
    setNewDesc('')
    setIsAdding(false)
  }

  function handleDelete(id: string) {
    setSessions(sessions.filter(s => s.id !== id))
  }

  const filtered = sessions.filter(s => s.day === dayFilter)

  return (
    <div className="p-5 sm:p-8 space-y-6 max-w-7xl mx-auto text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-xs font-mono font-bold text-[#efbd3b] uppercase">Program Directorate</span>
          <h1 className="text-2xl sm:text-3xl font-black">Schedule & Masterclass Manager</h1>
          <p className="text-xs text-white/60">
            Add, update, or reorganize daily sessions, halls, and speakers across the 4 conference days.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded-xl bg-[#efbd3b] px-4 py-2.5 text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition"
        >
          <Plus className="size-4" />
          <span>{isAdding ? 'Close Form' : 'Add New Session'}</span>
        </button>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map(d => (
          <button
            key={d}
            onClick={() => setDayFilter(d)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              dayFilter === d ? 'bg-[#efbd3b] text-[#062d31]' : 'bg-[#062d31] text-white/70 hover:text-white'
            }`}
          >
            Day 0{d} Sessions
          </button>
        ))}
      </div>

      {isAdding && (
        <form onSubmit={handleAddSession} className="rounded-3xl border border-[#efbd3b]/30 bg-[#062d31] p-6 space-y-4 text-xs animate-rise">
          <h3 className="text-sm font-bold text-[#ffd66a]">Add Session to Day 0{dayFilter}</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-white/70 mb-1 font-bold">Session Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Campus Leaders Awakening Track"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#041d24] p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-1 font-bold">Time Window</label>
              <input
                type="text"
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#041d24] p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-1 font-bold">Venue / Auditorium</label>
              <input
                type="text"
                value={newVenue}
                onChange={e => setNewVenue(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#041d24] p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-1 font-bold">Track Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full rounded-xl border border-white/15 bg-[#041d24] p-2.5 text-white"
              >
                <option value="Plenary">Plenary</option>
                <option value="Worship & Encounter">Worship & Encounter</option>
                <option value="Leadership Track">Leadership Track</option>
                <option value="Campus Forum">Campus Forum</option>
                <option value="Workshops">Workshops</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/70 mb-1 font-bold">Description</label>
            <textarea
              rows={2}
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#041d24] p-2.5 text-white"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-[#22c55e] px-6 py-2.5 text-xs font-black text-[#062d31]"
          >
            Save Session to Program
          </button>
        </form>
      )}

      {/* Sessions list */}
      <div className="space-y-4">
        {filtered.map(s => (
          <div key={s.id} className="rounded-2xl border border-white/10 bg-[#062d31] p-5 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#ffd66a]">{s.time}</span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/70">{s.category}</span>
                <span className="text-xs text-white/50">· {s.venue}</span>
              </div>
              <h4 className="text-base font-bold text-white mt-2">{s.title}</h4>
              <p className="text-xs text-white/60 mt-1">{s.description}</p>
            </div>
            <button
              onClick={() => handleDelete(s.id)}
              className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs"
              aria-label="Delete session"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
