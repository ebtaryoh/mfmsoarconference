'use client'

import React, { useState } from 'react'
import { OrganogramNode } from '@/lib/types'
import { LEADERSHIP_ORGANOGRAM } from '@/lib/conference-data'
import { 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  X,
  ExternalLink
} from 'lucide-react'

export function Organogram() {
  const [selectedDivision, setSelectedDivision] = useState<string>('All')
  const [activeNode, setActiveNode] = useState<OrganogramNode | null>(null)
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({})

  const toggleCollapse = (id: string) => {
    setCollapsedNodes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const divisions = ['All', 'Executive', 'Directorate', 'Planning Committee', 'Campus Network', 'Operations & Protocol']

  const filteredNodes = selectedDivision === 'All' 
    ? LEADERSHIP_ORGANOGRAM 
    : LEADERSHIP_ORGANOGRAM.filter(n => n.division === selectedDivision)

  // Group by level
  const levels = [1, 2, 3, 4, 5] as const

  return (
    <div className="w-full">
      {/* Division Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-8 border-b border-white/10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#efbd3b] mr-2">Filter Wing:</span>
        {divisions.map(div => (
          <button
            key={div}
            onClick={() => setSelectedDivision(div)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              selectedDivision === div 
                ? 'bg-[#efbd3b] text-[#062d31] shadow-md scale-105' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {div}
          </button>
        ))}
      </div>

      {/* Hierarchy Representation */}
      <div className="mt-8 space-y-10">
        {levels.map(lvl => {
          const nodesAtLevel = filteredNodes.filter(n => n.level === lvl)
          if (nodesAtLevel.length === 0) return null

          const levelTitles: Record<number, { title: string; subtitle: string }> = {
            1: { title: 'Apostolic Patronage', subtitle: 'Spiritual Covering & Worldwide Oversight' },
            2: { title: 'Conference Directorate', subtitle: 'Vision Casting & National Youth Convener' },
            3: { title: 'Central Planning & Operations', subtitle: 'Program Design, Logistics & Media Synergies' },
            4: { title: 'Campus Network & Systems Leads', subtitle: 'Tertiary Chapters, Technology Mesh & Usher Corps' },
            5: { title: 'Operational Frontline Units', subtitle: 'Merchandise Desk, Gate Scanning & Hospitality' }
          }

          return (
            <div key={lvl} className="relative">
              {/* Level Header Indicator */}
              <div className="flex items-center gap-3 mb-5">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#efbd3b]/20 border border-[#efbd3b] text-xs font-mono font-bold text-[#efbd3b]">
                  0{lvl}
                </span>
                <div>
                  <h4 className="text-sm font-bold tracking-tight text-white">{levelTitles[lvl].title}</h4>
                  <p className="text-xs text-white/50">{levelTitles[lvl].subtitle}</p>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent ml-2" />
              </div>

              {/* Grid of Nodes at this Level */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {nodesAtLevel.map(node => (
                  <div
                    key={node.id}
                    onClick={() => setActiveNode(node)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0b3b3e]/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#efbd3b]/70 hover:bg-[#0b3b3e] hover:shadow-[0_12px_30px_rgba(3,29,39,0.35)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-block rounded-md bg-[#efbd3b]/10 border border-[#efbd3b]/20 px-2.5 py-1 text-[11px] font-semibold text-[#efbd3b]">
                        {node.division}
                      </span>
                      <button 
                        aria-label="View details" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-1 text-[#efbd3b]"
                      >
                        <ExternalLink className="size-4" />
                      </button>
                    </div>

                    <h5 className="mt-4 text-base font-bold text-white group-hover:text-[#ffd66a] transition-colors">
                      {node.name}
                    </h5>
                    <p className="mt-1 text-xs font-medium text-[#ffd66a]/90">
                      {node.role}
                    </p>

                    <p className="mt-3 text-xs leading-relaxed text-white/60 line-clamp-2">
                      {node.bio}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-white/40">
                      <span>{node.responsibilities.length} key mandates</span>
                      <span className="text-[#efbd3b] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Mandate &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Node Detail Modal */}
      {activeNode && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveNode(null)}
        >
          <div 
            className="relative w-full max-w-lg rounded-3xl border border-[#efbd3b]/40 bg-[#062d31] p-6 text-[#f8f2e5] shadow-2xl sm:p-8"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveNode(null)}
              className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Close details"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#efbd3b]/15 px-3 py-1 text-xs font-bold text-[#efbd3b] border border-[#efbd3b]/30">
                {activeNode.division} Wing
              </span>
              <span className="text-xs text-white/40 font-mono">Level {activeNode.level}</span>
            </div>

            <h3 className="mt-4 text-2xl font-black text-white">{activeNode.name}</h3>
            <p className="text-sm font-semibold text-[#ffd66a] mt-1">{activeNode.role}</p>

            <div className="mt-5 rounded-xl bg-[#0b3b3e]/80 p-4 border border-white/10">
              <p className="text-xs leading-relaxed text-white/80">{activeNode.bio}</p>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#efbd3b] mb-3 flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#efbd3b]" />
                Key Responsibilities & Operational Mandates
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                {activeNode.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1 size-1.5 rounded-full bg-[#efbd3b] shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActiveNode(null)}
                className="rounded-full bg-[#efbd3b] px-6 py-2.5 text-xs font-extrabold text-[#062d31] hover:bg-[#ffd66a] transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
