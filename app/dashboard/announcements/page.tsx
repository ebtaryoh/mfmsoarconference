'use client'

import React, { useState, useEffect } from 'react'
import { 
  Radio, 
  Send, 
  AlertTriangle, 
  Bell, 
  Clock, 
  Users, 
  CheckCircle2, 
  Trash2,
  Eye
} from 'lucide-react'
import { getAnnouncements, saveAnnouncement } from '@/lib/storage'
import { ConferenceAnnouncement } from '@/lib/types'

export default function BroadcastCenterPage() {
  const [announcements, setAnnouncements] = useState<ConferenceAnnouncement[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<'urgent' | 'info' | 'schedule' | 'transport' | 'merchandise'>('info')
  const [targetAudience, setTargetAudience] = useState<'All Attendees' | 'Campus Leaders' | 'Youth Pastors' | 'Volunteers & Ushers'>('All Attendees')
  const [author, setAuthor] = useState('MFM Youth Directorate')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  function load() {
    setAnnouncements(getAnnouncements())
  }

  useEffect(() => {
    load()
    window.addEventListener('soar_announcements_updated', load)
    return () => window.removeEventListener('soar_announcements_updated', load)
  }, [])

  function handlePublish(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    saveAnnouncement({
      title: title.trim(),
      content: content.trim(),
      type,
      targetAudience,
      author: author.trim(),
      isActive: true,
      isPinned: type === 'urgent'
    })

    setTitle('')
    setContent('')
    setSuccessMsg('Announcement successfully published to all live conference channels.')
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  return (
    <div className="p-5 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-xs font-mono font-bold text-[#efbd3b] uppercase">Communications Directorate</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Broadcast Center</h1>
          <p className="text-xs text-white/60">
            Publish instant urgent alerts, gate advisories, and targeted messages to attendee wallets and the homepage banner.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-2xl border border-[#22c55e]/40 bg-[#22c55e]/15 p-4 text-xs font-bold text-[#22c55e] flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Composer Form (Cols 1-7) */}
        <div className="lg:col-span-7">
          <form 
            onSubmit={handlePublish}
            className="rounded-3xl border border-white/15 bg-[#062d31] p-6 sm:p-8 shadow-xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="size-4 text-[#efbd3b]" />
                Draft & Dispatch Notice
              </h3>
              <span className="text-[10px] font-mono text-white/40">
                Authorized Staff Only
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">
                Broadcast Title / Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Prayer City Gate 2 Shuttles Shuttle Schedule Update"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#041d24] px-4 py-3 text-xs text-white placeholder:text-white/30 focus:border-[#efbd3b] focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">
                  Broadcast Classification *
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full rounded-xl border border-white/15 bg-[#041d24] px-3 py-2.5 text-xs text-white focus:border-[#efbd3b] focus:outline-none"
                >
                  <option value="info">Informational Notice</option>
                  <option value="urgent">Urgent Gate Alert (Pinned)</option>
                  <option value="schedule">Schedule / Program Adjustment</option>
                  <option value="transport">Campus Transport / Shuttles</option>
                  <option value="merchandise">Merchandise Collection Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">
                  Target Audience *
                </label>
                <select
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value as any)}
                  className="w-full rounded-xl border border-white/15 bg-[#041d24] px-3 py-2.5 text-xs text-white focus:border-[#efbd3b] focus:outline-none"
                >
                  <option value="All Attendees">All Attendees</option>
                  <option value="Campus Leaders">Campus Leaders & Delegations</option>
                  <option value="Youth Pastors">Youth Pastors & Ministers</option>
                  <option value="Volunteers & Ushers">Volunteers & Ushers</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">
                Issuing Officer / Directorate
              </label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#041d24] px-4 py-2.5 text-xs text-white focus:border-[#efbd3b] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">
                Announcement Message Content *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Full text of the announcement to display on screens..."
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#041d24] p-3 text-xs text-white placeholder:text-white/30 focus:border-[#efbd3b] focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffd66a] via-[#efbd3b] to-[#d49a1d] py-3.5 text-xs font-black text-[#062d31] hover:brightness-110 transition shadow-lg"
              >
                <Send className="size-3.5" />
                <span>Publish Immediately to Live Channels</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview & Archive Stream (Cols 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Preview Box */}
          <div className="rounded-3xl border border-white/10 bg-[#062d31] p-6 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#efbd3b] mb-3 flex items-center gap-1.5">
              <Eye className="size-3.5" />
              Live Banner Preview
            </h4>

            <div className="rounded-2xl border border-[#efbd3b]/30 bg-gradient-to-r from-[#8d210f] via-[#0b3b3e] to-[#041d24] p-4 text-white text-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-[#efbd3b] px-2 py-0.5 text-[9px] font-black uppercase text-[#062d31]">
                  {type}
                </span>
                <span className="text-[10px] text-white/60">For {targetAudience}</span>
              </div>
              <p className="font-bold text-[#ffd66a]">{title || 'Headline will appear here'}</p>
              <p className="text-[11px] text-white/80 mt-1 leading-relaxed">
                {content || 'Your detailed message content will appear in the top banner and attendee wallets.'}
              </p>
            </div>
          </div>

          {/* Published Archive Stream */}
          <div className="rounded-3xl border border-white/10 bg-[#062d31] p-6 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">
              Recently Dispatched Broadcasts ({announcements.length})
            </h4>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {announcements.map(a => (
                <div key={a.id} className="rounded-2xl bg-[#041d24] p-4 border border-white/5 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#ffd66a] uppercase">{a.type}</span>
                    <span className="text-white/40 font-mono">{new Date(a.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h5 className="font-bold text-white">{a.title}</h5>
                  <p className="text-white/60 text-[11px] leading-relaxed line-clamp-2">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
