'use client'

import React, { useState, useEffect } from 'react'
import { 
  Layers, 
  Copy, 
  Plus, 
  Calendar, 
  Users, 
  Check, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  X
} from 'lucide-react'
import { getBlueprints, saveBlueprint } from '@/lib/storage'
import { EventBlueprint } from '@/lib/types'

export default function BlueprintsPage() {
  const [blueprints, setBlueprints] = useState<EventBlueprint[]>([])
  const [cloningBlueprint, setCloningBlueprint] = useState<EventBlueprint | null>(null)
  const [newEventName, setNewEventName] = useState('')
  const [newEventDates, setNewEventDates] = useState('')
  const [newEventTheme, setNewEventTheme] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    setBlueprints(getBlueprints())
  }, [])

  function openCloneModal(bp: EventBlueprint) {
    setCloningBlueprint(bp)
    setNewEventName(`${bp.name} (Copy)`)
    setNewEventDates('Proposed 2027')
    setNewEventTheme(bp.theme)
  }

  function handleExecuteClone(e: React.FormEvent) {
    e.preventDefault()
    if (!cloningBlueprint || !newEventName.trim()) return

    const cloned = saveBlueprint({
      name: newEventName.trim(),
      theme: newEventTheme.trim(),
      dates: newEventDates.trim(),
      venue: cloningBlueprint.venue,
      description: `Cloned blueprint from ${cloningBlueprint.name}. All ticketing forms, gate mesh configs, and schedule tracks replicated.`,
      estimatedAttendance: cloningBlueprint.estimatedAttendance,
      ticketTypes: [...cloningBlueprint.ticketTypes],
      tracks: [...cloningBlueprint.tracks],
      departments: [...cloningBlueprint.departments]
    })

    setBlueprints(getBlueprints())
    setCloningBlueprint(null)
    setSuccessMsg(`Successfully created event blueprint: "${cloned.name}"`)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  return (
    <div className="p-5 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-xs font-mono font-bold text-[#efbd3b] uppercase">Reusable Event Operating System</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Event Blueprints Library</h1>
          <p className="text-xs text-white/60">
            Replicate proven conference architectures, ticketing rules, volunteer team hierarchies, and turnstile configs for new MFM Youth events.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-2xl border border-[#22c55e]/40 bg-[#22c55e]/15 p-4 text-xs font-bold text-[#22c55e] flex items-center gap-2 animate-rise">
          <CheckCircle2 className="size-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Blueprint Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blueprints.map(bp => (
          <div
            key={bp.id}
            className="rounded-3xl border border-white/10 bg-[#062d31] p-6 text-white flex flex-col justify-between shadow-xl hover:border-[#efbd3b]/50 transition-all hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="rounded-full bg-[#efbd3b]/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#ffd66a]">
                  {bp.estimatedAttendance.toLocaleString()} Target
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  Last: {bp.lastUsedAt}
                </span>
              </div>

              <h3 className="text-lg font-black text-white mt-4">{bp.name}</h3>
              <p className="text-xs font-semibold text-[#ffd66a] mt-1">{bp.theme}</p>
              <p className="text-xs text-white/60 mt-3 leading-relaxed line-clamp-3">
                {bp.description}
              </p>

              {/* Blueprint Attributes */}
              <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-white/40 block mb-1">
                    Pre-configured Ticket Types
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {bp.ticketTypes.map(t => (
                      <span key={t} className="rounded bg-[#041d24] px-2 py-0.5 text-[10px] text-white/80 border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-white/40 block mb-1">
                    Program Tracks ({bp.tracks.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {bp.tracks.map(tr => (
                      <span key={tr} className="rounded bg-[#041d24] px-2 py-0.5 text-[10px] text-[#efbd3b] border border-white/5">
                        {tr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => openCloneModal(bp)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-xs font-bold text-white hover:bg-[#efbd3b] hover:text-[#062d31] transition"
              >
                <Copy className="size-3.5" />
                <span>Clone into New Event Blueprint</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CLONE MODAL */}
      {cloningBlueprint && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setCloningBlueprint(null)}
        >
          <div 
            className="relative w-full max-w-lg rounded-3xl border border-[#efbd3b]/40 bg-[#062d31] p-6 text-white shadow-2xl sm:p-8"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setCloningBlueprint(null)}
              className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>

            <span className="text-[10px] font-mono uppercase text-[#efbd3b] tracking-wider">
              Blueprint Replicator
            </span>
            <h2 className="text-xl font-black text-white mt-1">
              Clone: {cloningBlueprint.name}
            </h2>
            <p className="text-xs text-white/60 mt-1">
              This duplicates all registration fields, schedule structures, volunteer divisions, and gate mesh configs into a new event profile.
            </p>

            <form onSubmit={handleExecuteClone} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-white/80 font-bold mb-1">New Event Name *</label>
                <input
                  type="text"
                  required
                  value={newEventName}
                  onChange={e => setNewEventName(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#041d24] px-4 py-3 text-xs text-white focus:border-[#efbd3b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1">New Event Theme *</label>
                <input
                  type="text"
                  required
                  value={newEventTheme}
                  onChange={e => setNewEventTheme(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#041d24] px-4 py-3 text-xs text-white focus:border-[#efbd3b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1">Proposed Dates *</label>
                <input
                  type="text"
                  required
                  value={newEventDates}
                  onChange={e => setNewEventDates(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#041d24] px-4 py-3 text-xs text-white focus:border-[#efbd3b] focus:outline-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffd66a] via-[#efbd3b] to-[#d49a1d] py-3.5 text-xs font-black text-[#062d31] hover:brightness-110 transition shadow-lg"
                >
                  <Check className="size-4" />
                  <span>Execute Event Replication</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
