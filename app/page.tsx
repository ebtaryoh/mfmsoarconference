'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowUpRight, 
  CalendarDays, 
  ChevronDown, 
  Compass, 
  MapPin, 
  Ticket, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Clock, 
  ExternalLink, 
  ArrowRight,
  BookOpen,
  Award,
  Radio,
  ShoppingBag,
  Share2,
  CheckCircle2
} from 'lucide-react'
import { AnnouncementBanner } from '@/components/announcement-banner'
import { NavigationHeader } from '@/components/navigation'
import { CountdownTimer } from '@/components/countdown'
import { MotionTeaserModal } from '@/components/motion-teaser'
import { Organogram } from '@/components/organogram'
import { 
  CONFERENCE_INFO, 
  EDITIONS_ARCHIVE, 
  FAQS, 
  CONFERENCE_SCHEDULE 
} from '@/lib/conference-data'

export default function HomePage() {
  const [activeFaqCategory, setActiveFaqCategory] = useState(0)

  return (
    <div className="min-h-screen bg-[#041d24] text-[#f4efe4] selection:bg-[#efbd3b] selection:text-[#062d31]">
      {/* 1. ANNOUNCEMENT STRIP */}
      <AnnouncementBanner />

      {/* 2. NAVIGATION HEADER */}
      <NavigationHeader />

      {/* 3. CINEMATIC HERO SECTION */}
      <section id="top" className="relative isolate min-h-[92vh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Background Gradients & Textures */}
        <div className="absolute inset-0 -z-30 bg-[#041d24]" />
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_70%_25%,rgba(239,189,59,0.22)_0%,rgba(6,45,49,0.7)_40%,#041d24_85%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(141,33,15,0.25)_0%,transparent_40%,rgba(6,45,49,0.9)_100%)]" />

        {/* Floating Eagle Artwork */}
        <div className="pointer-events-none absolute right-[-22%] top-8 sm:right-[-12%] sm:top-12 lg:right-[-4%] lg:top-14 -z-10 w-[680px] sm:w-[840px] lg:w-[1020px] max-w-none opacity-60 sm:opacity-75 mix-blend-screen transition-all select-none">
          <img 
            src={CONFERENCE_INFO.heroArtwork} 
            alt="SOAR 2026 Eagle Crest Artwork in metallic gold" 
            className="animate-float w-full h-auto object-contain filter drop-shadow-[0_20px_50px_rgba(239,189,59,0.25)]" 
          />
        </div>

        {/* Ambient Glow Orbs */}
        <div className="absolute left-[-10%] top-1/4 -z-10 size-96 rounded-full bg-[#efbd3b]/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 bottom-0 -z-10 size-80 rounded-full bg-[#8d210f]/15 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content (Cols 1-7) */}
            <div className="lg:col-span-7 animate-rise">
              {/* Audience Pill */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#efbd3b]/40 bg-[#062d31]/80 px-4 py-1.5 backdrop-blur-md mb-6">
                <span className="flex size-2 rounded-full bg-[#efbd3b] animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ffd66a]">
                  Youth Pastors · Ministers · Workers · Campus Leaders
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.05em] leading-[0.92] text-white">
                Higher <br className="hidden sm:inline" />
                <span className="font-serif font-normal italic text-gold-gradient drop-shadow-sm">
                  Together.
                </span>
              </h1>

              {/* Tagline & Subtext */}
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/75 font-normal">
                The flagship national convocation of Mountain of Fire and Miracles Ministries Youth Ministry. Four consecrated days of apostolic power, leadership acceleration, inter-campus brotherhood, and generational commissioning.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#ffd66a] via-[#efbd3b] to-[#d49a1d] px-7 py-4 text-sm font-black text-[#062d31] shadow-[0_0_30px_rgba(239,189,59,0.35)] transition-all hover:scale-105 active:scale-95"
                >
                  <span>I&apos;m Coming to SOAR</span>
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>

                <MotionTeaserModal buttonText="Watch Motion Teaser" />

                <Link
                  href="/ticket"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-bold text-white/80 hover:text-white hover:border-white/30 backdrop-blur-sm transition"
                >
                  <Ticket className="size-4 text-[#efbd3b]" />
                  <span>My Ticket Pass</span>
                </Link>
              </div>

              {/* Live Countdown Clock */}
              <div className="mt-10 pt-6 border-t border-white/10 max-w-md">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#efbd3b] mb-3">
                  Conference Starts In:
                </p>
                <CountdownTimer targetDate={CONFERENCE_INFO.startDate} />
              </div>
            </div>

            {/* Right Card / Meta Info (Cols 8-12) */}
            <div className="lg:col-span-5 animate-rise [animation-delay:200ms]">
              <div className="relative overflow-hidden rounded-3xl border border-[#efbd3b]/30 bg-gradient-to-b from-[#0b3b3e]/80 to-[#062d31]/95 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                {/* Accent Watermark */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 size-36 rounded-full bg-[#efbd3b]/10 blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex size-2 rounded-full bg-[#22c55e] animate-ping" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ffd66a]">
                      Official Pass Desk
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-white/50">KM 12 Lagos-Ibadan</span>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#062d31] border border-[#efbd3b]/40 text-[#efbd3b]">
                      <CalendarDays className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Conference Dates</h4>
                      <p className="text-xl font-black text-[#ffd66a]">10–13 December 2026</p>
                      <p className="text-xs text-white/60">Thursday through Sunday</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#062d31] border border-[#efbd3b]/40 text-[#efbd3b]">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Conference Venue</h4>
                      <p className="text-lg font-bold text-white">MFM Prayer City</p>
                      <p className="text-xs text-white/60">KM 12 Lagos–Ibadan Expressway, Nigeria</p>
                      <a 
                        href={CONFERENCE_INFO.mapsUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#efbd3b] hover:underline"
                      >
                        Open in Google Maps <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#062d31] border border-[#efbd3b]/40 text-[#efbd3b]">
                      <Clock className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Daily Session Rhythm</h4>
                      <p className="text-lg font-bold text-[#ffd66a]">9:00 AM — 5:00 PM</p>
                      <p className="text-xs text-white/60">Main Plenary & Leadership Masterclasses</p>
                    </div>
                  </div>
                </div>

                {/* Turnstile QR Teaser Box */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#031d27]/70 p-4 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <p className="font-bold text-white">Instant Digital Turnstile Pass</p>
                    <p className="text-white/50 text-[11px] mt-0.5">Free registration · Scannable mobile pass</p>
                  </div>
                  <Link
                    href="/register"
                    className="shrink-0 rounded-full bg-[#efbd3b] px-3.5 py-1.5 text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition"
                  >
                    Claim Pass
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REGISTRATION MOMENTUM & SOCIAL PROOF */}
      <section className="border-y border-white/10 bg-[#031d27] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-[#062d31]/50 border border-white/5">
              <p className="font-mono text-3xl sm:text-4xl font-black text-[#ffd66a]">8,420+</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/60">Registered Delegates</p>
              <p className="mt-1 text-[11px] text-[#22c55e]">Target: 15,000 Capacity</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#062d31]/50 border border-white/5">
              <p className="font-mono text-3xl sm:text-4xl font-black text-[#ffd66a]">48+</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/60">Campus Chapters</p>
              <p className="mt-1 text-[11px] text-white/40">Tertiary Delegations</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#062d31]/50 border border-white/5">
              <p className="font-mono text-3xl sm:text-4xl font-black text-[#ffd66a]">4 Days</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/60">Intensive Immersion</p>
              <p className="mt-1 text-[11px] text-white/40">10–13 December 2026</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#062d31]/50 border border-white/5">
              <p className="font-mono text-3xl sm:text-4xl font-black text-[#ffd66a]">100%</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/60">Free Admission</p>
              <p className="mt-1 text-[11px] text-[#ffd66a]">Digital Pass Required</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHAT TO EXPECT - 5 PILLARS */}
      <section id="experience" className="bg-[#f4efe4] text-[#062d31] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#8d210f]">
              The Conference Atmosphere
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-[-0.04em] leading-tight">
              A sacred space to <span className="font-serif font-normal italic text-[#8d210f]">ascend.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#315358]">
              SOAR 2026 is intentionally curated to awaken young believers, empower campus ministry leaders, and release kingdom professionals with supernatural audacity.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Pillar 1 */}
            <div className="group rounded-3xl border border-[#062d31]/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#062d31] text-[#efbd3b] group-hover:scale-110 transition-transform">
                <Flame className="size-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[#062d31]">Spiritual Encounters & Worship</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#315358]">
                Intense morning glory prayers, deep prophetic intercession, and unbroken praise sessions that shift generational patterns.
              </p>
              <span className="mt-5 inline-block text-xs font-bold text-[#8d210f]">Altar of Fire &rarr;</span>
            </div>

            {/* Pillar 2 */}
            <div className="group rounded-3xl border border-[#062d31]/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#062d31] text-[#efbd3b] group-hover:scale-110 transition-transform">
                <Award className="size-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[#062d31]">Leadership Development</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#315358]">
                Masterclasses designed for youth pastors, workers, and leaders covering kingdom governance, organizational discipline, and ministry excellence.
              </p>
              <span className="mt-5 inline-block text-xs font-bold text-[#8d210f]">Leadership Track &rarr;</span>
            </div>

            {/* Pillar 3 */}
            <div className="group rounded-3xl border border-[#062d31]/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#062d31] text-[#efbd3b] group-hover:scale-110 transition-transform">
                <Users className="size-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[#062d31]">Campus Fellowship Network</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#315358]">
                Connecting presidents, executives, and leaders from dozens of tertiary institutions to build kingdom alliances across campuses.
              </p>
              <span className="mt-5 inline-block text-xs font-bold text-[#8d210f]">Campus Forum &rarr;</span>
            </div>

            {/* Pillar 4 */}
            <div className="group rounded-3xl border border-[#062d31]/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#062d31] text-[#efbd3b] group-hover:scale-110 transition-transform">
                <Compass className="size-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[#062d31]">Community & Fellowship</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#315358]">
                A vibrant gathering where young minds forge lifelong kingdom friendships, mentorship connections, and creative partnerships.
              </p>
              <span className="mt-5 inline-block text-xs font-bold text-[#8d210f]">Higher Together &rarr;</span>
            </div>

            {/* Pillar 5 */}
            <div className="group rounded-3xl border border-[#062d31]/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:col-span-2 lg:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#062d31] text-[#efbd3b] group-hover:scale-110 transition-transform">
                    <ShoppingBag className="size-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-[#062d31]">Conference Resources & Merchandise</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#315358] max-w-lg">
                    Official SOAR 2026 commemorative gear, oversized tees, metallic embroidered caps, leather journals, and ministry resources available for pre-order.
                  </p>
                </div>
                <Link
                  href="/store"
                  className="rounded-full bg-[#062d31] px-6 py-3 text-xs font-bold text-white hover:bg-[#0b474b] transition shrink-0"
                >
                  Browse Store &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Embedded Video Showcase */}
          <div className="mt-16 overflow-hidden rounded-3xl border-8 border-white bg-[#062d31] shadow-2xl relative">
            <video
              className="aspect-video w-full object-cover"
              src={CONFERENCE_INFO.motionVideo}
              poster={CONFERENCE_INFO.posterArtwork}
              autoPlay
              muted
              loop
              playsInline
              controls
              aria-label="SOAR 2026 Conference Motion Video"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#062d31] via-[#062d31]/80 to-transparent p-6 pt-16 sm:p-10">
              <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#efbd3b]">
                The SOAR Atmosphere
              </span>
              <p className="mt-2 text-xl sm:text-2xl font-bold text-white max-w-xl">
                A generation rising, moving, and worshipping higher together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PREVIOUS EDITIONS ARCHIVE */}
      <section id="editions" className="bg-[#062d31] py-20 lg:py-28 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#efbd3b]">
                The SOAR Legacy Archive
              </span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-[-0.04em] text-white">
                A movement with <span className="font-serif font-normal italic text-[#ffd66a]">history.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm text-white/60 leading-relaxed">
              Four editions documenting a rising generation. Each year marks a deeper altar and wider campus impact across the continent.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {EDITIONS_ARCHIVE.map(ed => (
              <div
                key={ed.year}
                className={`group relative overflow-hidden rounded-3xl border p-6 flex flex-col justify-between min-h-[340px] transition-all duration-300 hover:-translate-y-1.5 ${
                  ed.status === 'live' 
                    ? 'border-[#efbd3b] bg-gradient-to-b from-[#8d210f] to-[#0b3b3e] shadow-[0_10px_35px_rgba(239,189,59,0.25)]' 
                    : 'border-white/10 bg-[#0b3b3e]/60 hover:border-white/25'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-5xl font-black tracking-tight text-[#efbd3b] font-mono">
                      {ed.year}
                    </span>
                    {ed.status === 'live' ? (
                      <span className="rounded-full bg-[#efbd3b] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#062d31]">
                        Active Now
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-white/40">Archived</span>
                    )}
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-white">{ed.theme}</h3>
                  <p className="mt-2 text-xs text-white/60 leading-relaxed">{ed.highlight}</p>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6">
                  <p className="text-xs italic text-white/80">{ed.quote}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#ffd66a]">
                    <span>{ed.delegates}</span>
                    {ed.status === 'live' ? (
                      <Link href="/register" className="font-bold underline text-white">
                        Join 2026 &rarr;
                      </Link>
                    ) : (
                      <span className="text-white/40">{ed.dates}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LEADERSHIP & ORGANIZATIONAL HIERARCHY */}
      <section id="leadership" className="bg-[#031d27] py-20 lg:py-28 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#efbd3b]">
              Governance & Structure
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-[-0.04em] text-white">
              Leadership <span className="font-serif font-normal italic text-[#ffd66a]">Organogram.</span>
            </h2>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              The operational hierarchy ensuring spiritual accountability, seamless campus coordination, turnstile efficiency, and logistical excellence for SOAR 2026.
            </p>
          </div>

          <Organogram />
        </div>
      </section>

      {/* 8. SCHEDULE GLANCE */}
      <section className="bg-[#062d31] py-20 lg:py-28 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#efbd3b]">
                Daily Sessions & Agenda
              </span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-[-0.04em] text-white">
                Four days of <span className="font-serif font-normal italic text-[#ffd66a]">consecration.</span>
              </h2>
            </div>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#efbd3b] hover:text-[#ffd66a] transition"
            >
              <span>Explore Complete 4-Day Schedule</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { day: '01', title: 'Arrival & Opening Plenary', date: 'Thursday 10 Dec', highlight: 'Turnstile check-in & the sound of gathering eagles' },
              { day: '02', title: 'Formation & Fellowship', date: 'Friday 11 Dec', highlight: 'Morning glory intercession & leadership masterclasses' },
              { day: '03', title: 'Commissioning & Impartation', date: 'Saturday 12 Dec', highlight: 'Apostolic laying on of hands & campus mandates' },
              { day: '04', title: 'Thanksgiving & Sending Forth', date: 'Sunday 13 Dec', highlight: 'Grand celebration service & regional roll calls' },
            ].map(d => (
              <div key={d.day} className="rounded-2xl border border-white/10 bg-[#0b3b3e]/60 p-6 flex flex-col justify-between min-h-[220px]">
                <div>
                  <span className="font-mono text-3xl font-black text-[#efbd3b]">{d.day}</span>
                  <h3 className="mt-3 text-base font-bold text-white">{d.title}</h3>
                  <p className="mt-1 text-xs text-white/50">{d.date}</p>
                </div>
                <p className="text-xs text-white/70 border-t border-white/10 pt-4 mt-4">{d.highlight}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold text-white hover:border-[#efbd3b] transition"
            >
              <span>View Full Schedule & Speaker Tracks</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="bg-[#f4efe4] text-[#062d31] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#8d210f]">
                Good to Know
              </span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-[-0.04em] leading-tight">
                Frequently asked <span className="font-serif font-normal italic text-[#8d210f]">questions.</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#315358]">
                Everything you need to know about attendance accreditation, Prayer City logistics, group delegations, and merchandise pre-orders.
              </p>

              {/* Category selector */}
              <div className="mt-8 space-y-2">
                {FAQS.map((cat, i) => (
                  <button
                    key={cat.category}
                    onClick={() => setActiveFaqCategory(i)}
                    className={`w-full text-left rounded-xl px-4 py-3 text-xs font-bold transition-all ${
                      activeFaqCategory === i 
                        ? 'bg-[#062d31] text-white shadow-md' 
                        : 'bg-white/60 text-[#315358] hover:bg-white'
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="divide-y divide-[#062d31]/10 rounded-3xl bg-white p-6 sm:p-8 shadow-sm">
                {FAQS[activeFaqCategory].items.map((faq, idx) => (
                  <details key={idx} className="group py-5 first:pt-0 last:pb-0" open={idx === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-base text-[#062d31] marker:content-none hover:text-[#8d210f] transition-colors">
                      <span className="pr-4">{faq.q}</span>
                      <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180 text-[#8d210f]" />
                    </summary>
                    <p className="pt-3 text-sm leading-relaxed text-[#315358]">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. SOCIAL ATTENDANCE POSTER TEASER */}
      <section className="bg-[#031d27] py-16 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#efbd3b]/30 bg-gradient-to-r from-[#062d31] via-[#0b3b3e] to-[#031d27] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#efbd3b]">
                Personalized Social Badge
              </span>
              <h3 className="mt-3 text-3xl sm:text-4xl font-black text-white">
                Generate Your &quot;I Will Be Attending&quot; Poster
              </h3>
              <p className="mt-3 text-sm text-white/70">
                Upload your photo, pick a curated gold & teal frame, and share with your campus fellowship or WhatsApp status in high resolution.
              </p>
            </div>
            <Link
              href="/attend"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#efbd3b] px-7 py-4 text-sm font-black text-[#062d31] hover:bg-[#ffd66a] transition shadow-lg"
            >
              <span>Create My Poster</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FINAL REGISTRATION CALL TO ACTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#8d210f] via-[#b45422] to-[#8d210f] px-4 py-24 sm:px-6 lg:px-8 text-white">
        <div className="absolute -right-20 -top-20 size-80 rounded-full border-[50px] border-[#efbd3b]/20 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-end justify-between gap-10">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.28em] text-[#ffd66a]">
              Your Next Step
            </span>
            <h2 className="mt-4 text-5xl sm:text-7xl font-black tracking-[-0.05em] leading-[0.95]">
              Let&apos;s SOAR <br />
              <span className="font-serif font-normal italic text-[#ffd66a]">
                Higher Together.
              </span>
            </h2>
            <p className="mt-4 text-base text-white/80 max-w-lg">
              Registration takes under two minutes. Claim your turnstile QR code and prepare your spirit for December 10–13 at MFM Prayer City.
            </p>
          </div>

          <Link
            href="/register"
            className="group shrink-0 inline-flex items-center gap-3 rounded-full bg-[#f4efe4] px-8 py-5 text-base font-extrabold text-[#062d31] shadow-2xl transition hover:bg-white"
          >
            <span>Register for SOAR 2026</span>
            <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-[#8d210f]" />
          </Link>
        </div>
      </section>

      {/* 12. COMPREHENSIVE FOOTER */}
      <footer className="bg-[#031d27] border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-7xl flex flex-col gap-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#062d31] border border-[#efbd3b] text-xs font-bold text-[#efbd3b]">
                  MFM
                </div>
                <span className="text-lg font-black tracking-tight">SOAR <span className="text-[#ffd66a]">2026</span></span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/50">
                Official national conference platform of the Mountain of Fire and Miracles Ministries Youth Ministry.
              </p>
              <p className="mt-3 text-xs font-mono text-[#efbd3b]">
                10–13 December 2026 · MFM Prayer City
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#efbd3b] mb-3">Navigation</h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li><Link href="/register" className="hover:text-white">Register for Conference</Link></li>
                <li><Link href="/ticket" className="hover:text-white">My Digital Ticket Pass</Link></li>
                <li><Link href="/attend" className="hover:text-white">Attendance Poster Studio</Link></li>
                <li><Link href="/schedule" className="hover:text-white">Full 4-Day Schedule</Link></li>
                <li><Link href="/store" className="hover:text-white">Merchandise Store</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#efbd3b] mb-3">Event Operating System</h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li><Link href="/dashboard" className="hover:text-white">Event Command Center</Link></li>
                <li><Link href="/dashboard/check-in" className="hover:text-white">Usher QR Scanner</Link></li>
                <li><Link href="/dashboard/turnstile" className="hover:text-white">Turnstile Gate Kiosk</Link></li>
                <li><Link href="/dashboard/orders" className="hover:text-white">Merchandise Desk</Link></li>
                <li><Link href="/dashboard/blueprints" className="hover:text-white">Event Blueprints</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#efbd3b] mb-3">Support & Help Desk</h4>
              <p className="text-xs text-white/60">Questions regarding campus transit or accreditation?</p>
              <div className="mt-3 text-xs text-white/80 space-y-1">
                <p>Email: <a href={`mailto:${CONFERENCE_INFO.supportEmail}`} className="text-[#ffd66a] hover:underline">{CONFERENCE_INFO.supportEmail}</a></p>
                <p>Help Line: <span className="text-white">{CONFERENCE_INFO.supportPhone}</span></p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40">
            <p>© 2026 MFM Youth Ministry. All rights reserved. Built as the MFM Youth Event Operating System.</p>
            <div className="flex gap-6">
              <a href="#top" className="hover:text-white">Back to Top ↑</a>
              <Link href="/announcements" className="hover:text-white">Live Notices</Link>
              <Link href="/dashboard" className="hover:text-white">Organizer Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
