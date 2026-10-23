'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  Ticket, 
  ShoppingBag, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  ArrowUpRight,
  Flame,
  LayoutDashboard
} from 'lucide-react'

export function NavigationHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#experience', label: 'The Experience' },
    { href: '/#editions', label: 'Editions' },
    { href: '/#leadership', label: 'Leadership' },
    { href: '/schedule', label: 'Schedule' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/store', label: 'Store' },
    { href: '/attend', label: 'Poster Studio' },
  ]

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname.startsWith(href)) return true
    return false
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#062d31]/90 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="SOAR 2026 Home">
          <div className="relative flex size-10 items-center justify-center rounded-xl border border-[#efbd3b]/60 bg-gradient-to-br from-[#102f35] to-[#041d24] text-xs font-black text-[#efbd3b] shadow-[0_0_15px_rgba(239,189,59,0.2)] group-hover:scale-105 transition-transform">
            <span>MFM</span>
            <span className="absolute -bottom-1 -right-1 flex size-3 items-center justify-center rounded-full bg-[#8d210f] text-[7px] text-white">
              🔥
            </span>
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#efbd3b]">
              MFM Youth Ministry
            </p>
            <p className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              SOAR <span className="text-[#ffd66a]">2026</span>
              <span className="text-[9px] uppercase tracking-widest font-mono px-1.5 py-0.2 rounded bg-[#8d210f] text-white">
                Live
              </span>
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wide text-white/70" aria-label="Main Navigation">
          {navLinks.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors hover:text-[#ffd66a] ${
                isActive(link.href) ? 'text-[#ffd66a] font-bold' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/ticket"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-bold text-white transition hover:border-[#efbd3b] hover:bg-white/10"
            title="My Ticket & Attendee Wallet"
          >
            <Ticket className="size-3.5 text-[#efbd3b]" />
            <span>My Pass</span>
          </Link>

          <Link
            href="/dashboard"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/60 transition hover:text-white hover:border-white/20"
            title="Organizer Command Center"
          >
            <LayoutDashboard className="size-3 text-[#ffd66a]" />
            <span>OS</span>
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ffd66a] via-[#efbd3b] to-[#d49a1d] px-4 sm:px-5 py-2.5 text-xs font-black text-[#062d31] shadow-[0_0_20px_rgba(239,189,59,0.3)] transition hover:brightness-110 active:scale-95"
          >
            <span>Register</span>
            <ArrowUpRight className="size-3.5" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl border border-white/10 p-2 text-white/80 hover:bg-white/10 lg:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-t border-white/10 bg-[#062d31]/98 px-5 py-6 backdrop-blur-2xl lg:hidden animate-fade-in shadow-2xl">
          <div className="flex flex-col gap-4 text-sm font-semibold text-white/80">
            {navLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between border-b border-white/5 py-2 hover:text-[#ffd66a]"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="size-4 opacity-40" />
              </Link>
            ))}

            <div className="mt-4 grid grid-cols-2 gap-3 pt-3">
              <Link
                href="/ticket"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#efbd3b]/40 bg-[#0b3b3e] p-3 text-xs font-bold text-white"
              >
                <Ticket className="size-4 text-[#efbd3b]" />
                My Pass & Wallet
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 p-3 text-xs font-bold text-white/80"
              >
                <LayoutDashboard className="size-4 text-[#ffd66a]" />
                Organizer OS
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
