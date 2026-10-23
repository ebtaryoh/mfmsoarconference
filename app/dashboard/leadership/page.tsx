'use client'

import React, { useState } from 'react'
import { Users, Plus, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react'
import { LEADERSHIP_ORGANOGRAM } from '@/lib/conference-data'
import { OrganogramNode } from '@/lib/types'

export default function LeadershipManagerPage() {
  const [nodes, setNodes] = useState<OrganogramNode[]>(LEADERSHIP_ORGANOGRAM)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [division, setDivision] = useState<'Executive' | 'Directorate' | 'Planning Committee' | 'Campus Network' | 'Operations & Protocol'>('Campus Network')
  const [bio, setBio] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !role.trim()) return

    const newNode: OrganogramNode = {
      id: `lead-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      division,
      level: 4,
      bio: bio.trim() || 'Leadership officer coordinating youth ministry assignments.',
      responsibilities: ['Oversee assigned youth delegates', 'Report to central planning committee']
    }

    setNodes([...nodes, newNode])
    setName('')
    setRole('')
    setBio('')
    setIsAdding(false)
  }

  function handleDelete(id: string) {
    setNodes(nodes.filter(n => n.id !== id))
  }

  return (
    <div className="p-5 sm:p-8 space-y-6 max-w-7xl mx-auto text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-xs font-mono font-bold text-[#efbd3b] uppercase">Governance & Secretariat</span>
          <h1 className="text-2xl sm:text-3xl font-black">Organogram & Directorate Leads</h1>
          <p className="text-xs text-white/60">
            Maintain the organizational hierarchy, titles, and operational mandates displayed on the public landing page.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded-xl bg-[#efbd3b] px-4 py-2.5 text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition"
        >
          <Plus className="size-4" />
          <span>{isAdding ? 'Close Form' : 'Add Directorate Node'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="rounded-3xl border border-[#efbd3b]/30 bg-[#062d31] p-6 space-y-4 text-xs animate-rise">
          <h3 className="text-sm font-bold text-[#ffd66a]">Add Directorate Leader / Officer</h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-white/70 mb-1 font-bold">Officer / Committee Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Campus Fellowship Zonal Overseer"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#041d24] p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-1 font-bold">Title / Designation *</label>
              <input
                type="text"
                required
                placeholder="e.g. Zonal Coordinator"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#041d24] p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-1 font-bold">Division Wing</label>
              <select
                value={division}
                onChange={e => setDivision(e.target.value as any)}
                className="w-full rounded-xl border border-white/15 bg-[#041d24] p-2.5 text-white"
              >
                <option value="Executive">Executive</option>
                <option value="Directorate">Directorate</option>
                <option value="Planning Committee">Planning Committee</option>
                <option value="Campus Network">Campus Network</option>
                <option value="Operations & Protocol">Operations & Protocol</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/70 mb-1 font-bold">Bio & Mandate Summary</label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#041d24] p-2.5 text-white"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-[#22c55e] px-6 py-2.5 text-xs font-black text-[#062d31]"
          >
            Save to Organogram
          </button>
        </form>
      )}

      {/* Nodes grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {nodes.map(n => (
          <div key={n.id} className="rounded-2xl border border-white/10 bg-[#062d31] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-[#efbd3b]/15 px-2 py-0.5 text-[10px] font-bold text-[#ffd66a]">
                  {n.division}
                </span>
                <span className="text-[10px] text-white/40 font-mono">Level {n.level}</span>
              </div>
              <h4 className="text-base font-bold text-white mt-3">{n.name}</h4>
              <p className="text-xs text-[#efbd3b] font-medium mt-0.5">{n.role}</p>
              <p className="text-xs text-white/60 mt-2 line-clamp-2 leading-relaxed">{n.bio}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-white/40">
              <span>{n.responsibilities.length} mandates</span>
              <button
                onClick={() => handleDelete(n.id)}
                className="text-red-400 hover:text-red-300"
                aria-label="Delete node"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
