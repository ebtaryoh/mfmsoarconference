'use client'

import React, { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  PieChart, 
  Download, 
  Printer, 
  QrCode, 
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react'
import { QRCodeDisplay } from '@/components/qr-code'
import { CONFERENCE_INFO } from '@/lib/conference-data'

export default function AnalyticsAndPostersPage() {
  const [printCampus, setPrintCampus] = useState('Campus Fellowship Noticeboard')

  // Print promotional flyer handler
  function handlePrintPoster() {
    window.print()
  }

  const campusBreakdowns = [
    { campus: 'University of Lagos (UNILAG)', count: 1240, percentage: 14.7 },
    { campus: 'Obafemi Awolowo University (OAU)', count: 980, percentage: 11.6 },
    { campus: 'University of Ibadan (UI)', count: 850, percentage: 10.1 },
    { campus: 'Federal Univ. of Tech. Akure (FUTA)', count: 720, percentage: 8.5 },
    { campus: 'Lagos State University (LASU)', count: 680, percentage: 8.1 },
    { campus: 'Covenant & Bells Universities', count: 540, percentage: 6.4 },
    { campus: 'Other Tertiary Chapters & Diaspora', count: 3410, percentage: 40.5 }
  ]

  const roleMix = [
    { role: 'Young Persons / Delegates', percentage: 58, color: '#ffd66a' },
    { role: 'Campus Fellowship Executives', percentage: 22, color: '#efbd3b' },
    { role: 'Youth Pastors & Ministers', percentage: 12, color: '#8d210f' },
    { role: 'Ushers, Media & Volunteers', percentage: 8, color: '#22c55e' }
  ]

  const hourlyGateThroughput = [
    { time: '08:00 AM', count: 620 },
    { time: '09:00 AM', count: 1450 },
    { time: '10:00 AM', count: 1820 },
    { time: '11:00 AM', count: 980 },
    { time: '12:00 PM', count: 320 }
  ]

  return (
    <div className="p-5 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-xs font-mono font-bold text-[#efbd3b] uppercase">Intelligence & Telemetry</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Analytics & Print Tools</h1>
          <p className="text-xs text-white/60">
            Attendance velocity, campus distribution statistics, and print-ready venue registration posters.
          </p>
        </div>

        <button
          onClick={handlePrintPoster}
          className="flex items-center gap-2 rounded-xl bg-[#efbd3b] px-4 py-2.5 text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition shadow-md"
        >
          <Printer className="size-3.5" />
          <span>Print Venue Registration Poster</span>
        </button>
      </div>

      {/* Grid: Campus Breakdown & Role Mix */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Campus Delegations (Cols 1-7) */}
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#062d31] p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="size-4 text-[#efbd3b]" />
                Top Campus Fellowships & Units
              </h3>
              <p className="text-[11px] text-white/50">48 participating tertiary delegations</p>
            </div>
            <span className="font-mono text-xs font-bold text-[#ffd66a]">8,420 Total</span>
          </div>

          <div className="mt-5 space-y-4">
            {campusBreakdowns.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-white/90">{item.campus}</span>
                  <span className="font-mono text-white/60">{item.count.toLocaleString()} ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#041d24] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#efbd3b] to-[#ffd66a]"
                    style={{ width: `${item.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role & Category Mix (Cols 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#062d31] p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <PieChart className="size-4 text-[#efbd3b]" />
              Attendee Role Demographics
            </h3>

            <div className="mt-5 space-y-3">
              {roleMix.map((rm, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#041d24] border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className="size-3 rounded-full" style={{ backgroundColor: rm.color }} />
                    <span className="text-xs font-medium text-white">{rm.role}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#ffd66a]">{rm.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Turnstile Hourly Rate */}
          <div className="rounded-3xl border border-white/10 bg-[#062d31] p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <TrendingUp className="size-4 text-[#22c55e]" />
              Gate Flow Velocity (Peak Morning Arrival)
            </h3>

            <div className="mt-5 flex items-end justify-between gap-2 h-32 pt-4 px-2">
              {hourlyGateThroughput.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono text-white/50">{h.count}</span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#0b3b3e] to-[#efbd3b] transition-all duration-500"
                    style={{ height: `${(h.count / 2000) * 100}%` }}
                  />
                  <span className="text-[9px] font-mono text-white/40">{h.time.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PRINT-READY VENUE POSTER GENERATOR */}
      <div className="rounded-3xl border border-[#efbd3b]/30 bg-[#062d31] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#efbd3b]">
              Administrative Print Collateral
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              Venue Registration & Turnstile Entry Poster
            </h3>
            <p className="text-xs text-white/60">
              Printable A4 / A3 poster with instant camera registration QR code for fellowship halls and Prayer City entrance noticeboards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={printCampus}
              onChange={e => setPrintCampus(e.target.value)}
              placeholder="Campus / Fellowship Label"
              className="rounded-xl border border-white/15 bg-[#041d24] px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Printable Card Preview */}
        <div className="mt-6 max-w-md mx-auto rounded-3xl border-4 border-[#efbd3b] bg-[#041d24] p-8 text-center text-white shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#efbd3b]">
              MFM YOUTH MINISTRY
            </span>
          </div>

          <h2 className="text-3xl font-black text-white">SOAR 2026</h2>
          <p className="font-serif italic text-[#ffd66a] text-lg">Higher Together</p>

          <div className="my-6 p-4 bg-white rounded-2xl inline-block shadow-inner">
            <QRCodeDisplay
              value="https://soar2026.mfmyouth.org/register"
              size={180}
              fgColor="#062d31"
              bgColor="#ffffff"
              label="SCAN TO REGISTER FOR FREE"
            />
          </div>

          <p className="text-xs font-bold text-white uppercase tracking-wider">
            {printCampus}
          </p>
          <p className="text-[11px] text-white/60 mt-1">
            10–13 December 2026 · MFM Prayer City, KM 12
          </p>

          <p className="mt-4 text-[10px] text-[#ffd66a] font-mono border-t border-white/10 pt-3">
            Instant Turnstile QR Code Issued Upon Registration
          </p>
        </div>
      </div>
    </div>
  )
}
