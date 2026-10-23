'use client'

import React, { useState } from 'react'
import { Settings, Save, ShieldCheck, Check } from 'lucide-react'
import { CONFERENCE_INFO } from '@/lib/conference-data'

export default function DashboardSettingsPage() {
  const [dates, setDates] = useState(CONFERENCE_INFO.dates)
  const [venue, setVenue] = useState(CONFERENCE_INFO.venueDetail)
  const [capacity, setCapacity] = useState(CONFERENCE_INFO.expectedCapacity)
  const [supportEmail, setSupportEmail] = useState(CONFERENCE_INFO.supportEmail)
  const [supportPhone, setSupportPhone] = useState(CONFERENCE_INFO.supportPhone)
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-5 sm:p-8 space-y-6 max-w-4xl mx-auto text-white">
      <div className="border-b border-white/10 pb-5">
        <span className="text-xs font-mono font-bold text-[#efbd3b] uppercase">System Configuration</span>
        <h1 className="text-2xl sm:text-3xl font-black">Event Operating System Settings</h1>
        <p className="text-xs text-white/60">
          Manage core conference parameters, venue address strings, and gate limits.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl border border-[#22c55e]/40 bg-[#22c55e]/15 text-xs font-bold text-[#22c55e] flex items-center gap-2">
          <Check className="size-4" />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-3xl border border-white/10 bg-[#062d31] p-6 sm:p-8 space-y-5 text-xs">
        <div>
          <label className="block text-white/80 font-bold mb-1.5">Official Conference Dates</label>
          <input
            type="text"
            value={dates}
            onChange={e => setDates(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-[#041d24] p-3 text-white focus:border-[#efbd3b] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white/80 font-bold mb-1.5">Venue & Address Descriptor</label>
          <input
            type="text"
            value={venue}
            onChange={e => setVenue(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-[#041d24] p-3 text-white focus:border-[#efbd3b] focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-white/80 font-bold mb-1.5">Max Venue Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={e => setCapacity(parseInt(e.target.value) || 0)}
              className="w-full rounded-xl border border-white/15 bg-[#041d24] p-3 text-white focus:border-[#efbd3b] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-white/80 font-bold mb-1.5">Gate Mesh Status</label>
            <div className="rounded-xl border border-white/15 bg-[#041d24] p-3 text-white font-mono flex items-center gap-2 text-xs">
              <span className="size-2 rounded-full bg-[#22c55e] animate-ping" />
              <span>Mesh Synchronized (4/4 Nodes Active)</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-white/80 font-bold mb-1.5">Public Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={e => setSupportEmail(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#041d24] p-3 text-white focus:border-[#efbd3b] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-white/80 font-bold mb-1.5">Emergency Helpline</label>
            <input
              type="text"
              value={supportPhone}
              onChange={e => setSupportPhone(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#041d24] p-3 text-white focus:border-[#efbd3b] focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-[#efbd3b] px-6 py-3 text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
