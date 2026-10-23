'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  ScanLine, 
  DoorClosed, 
  ShoppingBag, 
  Radio, 
  Layers, 
  BarChart3, 
  Calendar, 
  ArrowLeft, 
  Menu, 
  X, 
  ShieldCheck, 
  Wifi,
  ExternalLink
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { href: '/dashboard/attendees', label: 'Attendee Directory', icon: Users },
    { href: '/dashboard/check-in', label: 'Usher QR Scanner', icon: ScanLine },
    { href: '/dashboard/turnstile', label: 'Turnstile Kiosk', icon: DoorClosed },
    { href: '/dashboard/orders', label: 'Merchandise Desk', icon: ShoppingBag },
    { href: '/dashboard/announcements', label: 'Broadcast Center', icon: Radio },
    { href: '/dashboard/blueprints', label: 'Event Blueprints', icon: Layers },
    { href: '/dashboard/analytics', label: 'Live Analytics', icon: BarChart3 },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true
    if (href !== '/dashboard' && pathname.startsWith(href)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-[#031d27] text-[#f4efe4] flex flex-col lg:flex-row selection:bg-[#efbd3b] selection:text-[#062d31]">
      {/* Mobile Top Navigation */}
      <header className="lg:hidden flex items-center justify-between border-b border-white/10 bg-[#062d31] p-4 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#efbd3b] text-xs font-black text-[#062d31]">
            OS
          </div>
          <span className="text-sm font-black text-white">
            SOAR <span className="text-[#ffd66a]">OS</span>
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg border border-white/10 p-2 text-white/80"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {/* Desktop Persistent Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#062d31] border-r border-white/10 flex flex-col justify-between p-5 transition-transform duration-300 lg:static lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Brand & System Status */}
          <div className="border-b border-white/10 pb-5">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffd66a] to-[#efbd3b] text-sm font-black text-[#062d31] shadow-[0_0_15px_rgba(239,189,59,0.3)]">
                EOS
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#efbd3b]">
                  Event Operating System
                </p>
                <h2 className="text-base font-black text-white">SOAR 2026</h2>
              </div>
            </Link>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#041d24] px-3 py-2 border border-white/5 text-[11px]">
              <span className="flex size-2 rounded-full bg-[#22c55e] animate-ping" />
              <span className="font-mono text-white/80">Gate Mesh Online</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1" aria-label="Dashboard Navigation">
            {navItems.map(item => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#ffd66a] to-[#efbd3b] text-[#062d31] shadow-md'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`size-4 ${active ? 'text-[#062d31]' : 'text-[#efbd3b]'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Link back to Public Experience */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#041d24] px-3.5 py-2.5 text-xs font-bold text-white/70 hover:text-white hover:border-[#efbd3b] transition"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="size-3.5" />
              Public Landing Page
            </span>
            <ExternalLink className="size-3 opacity-50" />
          </Link>
          <p className="text-[10px] text-white/30 text-center font-mono">
            MFM Youth Ministry OS v2.6
          </p>
        </div>
      </aside>

      {/* Main Operational Canvas */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
