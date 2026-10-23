'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Bell, 
  AlertTriangle, 
  Filter, 
  Clock, 
  UserCheck, 
  Share2, 
  ShieldCheck 
} from 'lucide-react'
import { getAnnouncements } from '@/lib/storage'
import { ConferenceAnnouncement } from '@/lib/types'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<ConferenceAnnouncement[]>([])
  const [selectedType, setSelectedType] = useState<string>('All')

  useEffect(() => {
    function load() {
      setAnnouncements(getAnnouncements())
    }
    load()
    window.addEventListener('soar_announcements_updated', load)
    return () => window.removeEventListener('soar_announcements_updated', load)
  }, [])

  const types = ['All', 'urgent', 'info', 'schedule', 'transport', 'merchandise']

  const filtered = selectedType === 'All'
    ? announcements
    : announcements.filter(a => a.type === selectedType)

  return (
    <main className="min-h-screen bg-[#041d24] text-[#f4efe4] selection:bg-[#efbd3b] selection:text-[#062d31]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#062d31]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition"
          >
            <ArrowLeft className="size-4" />
            <span>SOAR 2026 Home</span>
          </Link>
          <span className="text-xs font-black uppercase tracking-wider text-[#ffd66a]">
            Official Announcements & Alerts
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#efbd3b]">
            Broadcast Feed
          </span>
          <h1 className="mt-2 text-4xl sm:text-5xl font-black text-white tracking-tight">
            Live <span className="font-serif font-normal italic text-[#ffd66a]">Announcements.</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-white/65">
            Verified updates from the MFM Youth Directorate, Protocol Leads, Campus Fellowship Logistics, and Prayer City Gate Mesh.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-white/10 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-white/40 mr-2 flex items-center gap-1">
            <Filter className="size-3.5" />
            Filter:
          </span>
          {types.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                selectedType === t
                  ? 'bg-[#efbd3b] text-[#062d31]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* List of Announcements */}
        <div className="space-y-5">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#062d31] p-12 text-center text-white/50">
              <p>No announcements found in this category.</p>
            </div>
          ) : (
            filtered.map(ann => (
              <article
                key={ann.id}
                className={`rounded-3xl border p-6 sm:p-7 transition-all ${
                  ann.type === 'urgent'
                    ? 'border-[#8d210f] bg-gradient-to-r from-[#8d210f]/40 to-[#062d31] shadow-lg'
                    : 'border-white/10 bg-[#062d31]/80 hover:border-white/20'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                      ann.type === 'urgent'
                        ? 'bg-[#8d210f] text-white'
                        : 'bg-[#efbd3b] text-[#062d31]'
                    }`}>
                      {ann.type === 'urgent' && <AlertTriangle className="size-3" />}
                      {ann.type}
                    </span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/70">
                      Target: {ann.targetAudience}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-white/50 flex items-center gap-1">
                    <Clock className="size-3" />
                    {new Date(ann.publishedAt).toLocaleString()}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {ann.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed">
                    {ann.content}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-white/40">
                  <span>Authorized by: <strong className="text-white/70">{ann.author}</strong></span>
                  <span className="text-[#ffd66a] font-semibold">Official Dispatch</span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
