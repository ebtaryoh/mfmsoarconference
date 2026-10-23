'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAnnouncements } from '@/lib/storage'
import { ConferenceAnnouncement } from '@/lib/types'
import { Bell, ChevronRight, X, AlertTriangle } from 'lucide-react'

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<ConferenceAnnouncement[]>([])
  const [dismissed, setDismissed] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    function load() {
      const all = getAnnouncements()
      setAnnouncements(all.filter(a => a.isActive))
    }
    load()
    window.addEventListener('soar_announcements_updated', load)
    return () => window.removeEventListener('soar_announcements_updated', load)
  }, [])

  if (dismissed || announcements.length === 0) return null

  const current = announcements[currentIndex] || announcements[0]

  return (
    <div className="relative z-50 bg-gradient-to-r from-[#8d210f] via-[#0b3b3e] to-[#041d24] text-white border-b border-[#efbd3b]/30 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:text-sm">
        <div className="flex items-center gap-3 overflow-hidden pr-4">
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#efbd3b] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#062d31]">
            {current.type === 'urgent' ? (
              <>
                <AlertTriangle className="size-3" />
                Alert
              </>
            ) : (
              <>
                <Bell className="size-3" />
                Notice
              </>
            )}
          </span>

          <p className="truncate font-medium text-white/95">
            <span className="font-bold text-[#ffd66a] mr-2">{current.title}:</span>
            <span className="text-white/80">{current.content}</span>
          </p>

          <Link
            href="/announcements"
            className="hidden md:inline-flex items-center gap-1 font-bold text-[#ffd66a] hover:underline shrink-0 text-xs"
          >
            All Updates <ChevronRight className="size-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {announcements.length > 1 && (
            <div className="flex items-center gap-1 mr-2 text-[10px] text-white/60">
              <button
                onClick={() => setCurrentIndex((currentIndex - 1 + announcements.length) % announcements.length)}
                className="hover:text-white px-1"
                aria-label="Previous announcement"
              >
                &larr;
              </button>
              <span>{currentIndex + 1}/{announcements.length}</span>
              <button
                onClick={() => setCurrentIndex((currentIndex + 1) % announcements.length)}
                className="hover:text-white px-1"
                aria-label="Next announcement"
              >
                &rarr;
              </button>
            </div>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="rounded p-1 text-white/60 hover:bg-white/10 hover:text-white transition"
            aria-label="Dismiss banner"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
