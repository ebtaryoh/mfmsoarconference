'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Ticket, 
  ExternalLink, 
  X,
  Share2,
  Copy,
  Check
} from 'lucide-react'
import { getAttendees, checkInAttendee } from '@/lib/storage'
import { Attendee } from '@/lib/types'

export default function AttendeesDirectoryPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null)
  const [feedback, setFeedback] = useState('')
  const [copied, setCopied] = useState(false)

  function loadData() {
    setAttendees(getAttendees())
  }

  useEffect(() => {
    loadData()
    window.addEventListener('soar_attendees_updated', loadData)
    return () => window.removeEventListener('soar_attendees_updated', loadData)
  }, [])

  const filtered = attendees.filter(a => {
    const s = search.toLowerCase()
    const matchesSearch = 
      a.fullName.toLowerCase().includes(s) ||
      a.email.toLowerCase().includes(s) ||
      a.phone.includes(s) ||
      a.reference.toLowerCase().includes(s) ||
      a.unitOrCampus.toLowerCase().includes(s)

    const matchesRole = roleFilter === 'All' || a.role === roleFilter
    const matchesStatus = statusFilter === 'All' || a.checkInStatus === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  function handleManualCheckIn(reference: string) {
    const res = checkInAttendee(reference, 'Manual Desk (Admin Override)', 'Supervisor Terminal')
    setFeedback(res.message)
    if (res.attendee) {
      setSelectedAttendee(res.attendee)
    }
    setTimeout(() => setFeedback(''), 4000)
  }

  function exportCSV() {
    const headers = ['Reference', 'Full Name', 'Role', 'Category', 'Unit/Campus', 'Email', 'Phone', 'State', 'Status', 'CheckedInAt', 'Gate']
    const rows = filtered.map(a => [
      `"${a.reference}"`,
      `"${a.fullName}"`,
      `"${a.role}"`,
      `"${a.category}"`,
      `"${a.unitOrCampus}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.stateOrRegion}"`,
      `"${a.checkInStatus}"`,
      `"${a.checkedInAt || ''}"`,
      `"${a.gate || ''}"`
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `SOAR-2026-Attendees-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-5 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-[#efbd3b] uppercase">Accreditation Registry</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Attendee Directory</h1>
          <p className="text-xs text-white/60">
            Search, filter, manually verify, and export registered conference delegates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition"
          >
            <Download className="size-3.5 text-[#efbd3b]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="rounded-2xl border border-[#22c55e]/40 bg-[#22c55e]/10 p-4 text-xs font-bold text-[#22c55e] flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')}><X className="size-4" /></button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="grid gap-3 sm:grid-cols-12 rounded-2xl border border-white/10 bg-[#062d31] p-4 text-xs">
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3.5 top-3 size-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by name, email, phone, reference, or campus..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-[#041d24] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/30 focus:border-[#efbd3b] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-[#041d24] px-3 py-2.5 text-xs text-white focus:border-[#efbd3b] focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Youth Pastor / Minister">Youth Pastors</option>
            <option value="Campus Fellowship Leader">Campus Leaders</option>
            <option value="Worker">Workers</option>
            <option value="Young Person">Young People</option>
            <option value="Volunteer / Usher">Volunteers & Ushers</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-[#041d24] px-3 py-2.5 text-xs text-white focus:border-[#efbd3b] focus:outline-none"
          >
            <option value="All">All Gate Statuses</option>
            <option value="checked_in">Checked In</option>
            <option value="not_checked_in">Not Checked In</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-white/10 bg-[#062d31] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#041d24] text-white/50">
                <th className="p-4 font-bold">Attendee & Contact</th>
                <th className="p-4 font-bold">Role & Category</th>
                <th className="p-4 font-bold">Campus / Church Unit</th>
                <th className="p-4 font-bold">Reference</th>
                <th className="p-4 font-bold">Check-in Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-white/40">
                    No attendees match your search filters.
                  </td>
                </tr>
              ) : (
                filtered.map(att => (
                  <tr key={att.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <strong className="text-white font-bold block">{att.fullName}</strong>
                      <span className="text-[11px] text-white/50">{att.email}</span>
                      <span className="text-[10px] text-white/40 font-mono block">{att.phone}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-white/90">{att.role}</span>
                      <span className="block text-[10px] text-[#efbd3b]">{att.category}</span>
                    </td>
                    <td className="p-4 text-white/70 max-w-[180px] truncate">
                      {att.unitOrCampus}
                      <span className="block text-[10px] text-white/40">{att.stateOrRegion}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#ffd66a]">
                      {att.reference}
                    </td>
                    <td className="p-4">
                      {att.checkInStatus === 'checked_in' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#22c55e]/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#22c55e]">
                          <CheckCircle2 className="size-3" />
                          Checked In
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-mono text-white/50">
                          Pre-Registered
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedAttendee(att)}
                          className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-white/10"
                        >
                          Inspect
                        </button>
                        {att.checkInStatus !== 'checked_in' && (
                          <button
                            onClick={() => handleManualCheckIn(att.reference)}
                            className="rounded-lg bg-[#22c55e] px-2.5 py-1.5 text-[11px] font-bold text-[#062d31] hover:bg-[#16a34a] transition"
                          >
                            Check In
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT MODAL */}
      {selectedAttendee && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedAttendee(null)}
        >
          <div 
            className="relative w-full max-w-lg rounded-3xl border border-[#efbd3b]/40 bg-[#062d31] p-6 text-white shadow-2xl sm:p-8"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAttendee(null)}
              className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>

            <span className="text-[10px] font-mono uppercase text-[#efbd3b] tracking-wider">
              Delegate Dossier
            </span>
            <h2 className="text-2xl font-black text-white mt-1">{selectedAttendee.fullName}</h2>
            <p className="text-xs text-[#ffd66a] font-semibold mt-0.5">
              {selectedAttendee.role} · {selectedAttendee.category}
            </p>

            <div className="mt-6 divide-y divide-white/10 rounded-2xl bg-[#041d24] p-4 text-xs space-y-2">
              <div className="flex justify-between py-1.5">
                <span className="text-white/40">Reference</span>
                <span className="font-mono font-bold text-white">{selectedAttendee.reference}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-white/40">Email</span>
                <span className="text-white font-mono">{selectedAttendee.email}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-white/40">WhatsApp Phone</span>
                <span className="text-white font-mono">{selectedAttendee.phone}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-white/40">Campus / Church Unit</span>
                <span className="text-white font-medium">{selectedAttendee.unitOrCampus}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-white/40">State / Region</span>
                <span className="text-white">{selectedAttendee.stateOrRegion}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-white/40">Gate Status</span>
                <span className={`font-mono font-bold ${
                  selectedAttendee.checkInStatus === 'checked_in' ? 'text-[#22c55e]' : 'text-white/50'
                }`}>
                  {selectedAttendee.checkInStatus === 'checked_in' 
                    ? `Checked in at ${selectedAttendee.gate || 'Gate 1'}` 
                    : 'Not checked in yet'}
                </span>
              </div>
            </div>

            {/* Actions in Modal */}
            <div className="mt-6 flex flex-wrap gap-2 pt-2">
              <Link
                href={`/ticket/${selectedAttendee.reference}`}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-bold text-white hover:bg-white/10"
              >
                <Ticket className="size-3.5 text-[#efbd3b]" />
                <span>Open Digital Pass</span>
                <ExternalLink className="size-3 opacity-50" />
              </Link>

              {selectedAttendee.checkInStatus !== 'checked_in' && (
                <button
                  onClick={() => handleManualCheckIn(selectedAttendee.reference)}
                  className="flex-1 rounded-xl bg-[#22c55e] py-3 text-xs font-black text-[#062d31] hover:bg-[#16a34a] transition"
                >
                  Manual Gate Check-In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
