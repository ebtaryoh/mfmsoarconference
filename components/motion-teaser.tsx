'use client'

import React, { useState } from 'react'
import { Play, X, Volume2, VolumeX, Maximize2 } from 'lucide-react'

interface MotionTeaserProps {
  buttonText?: string
  buttonClass?: string
  iconOnly?: boolean
}

export function MotionTeaserModal({
  buttonText = 'Watch Motion Teaser',
  buttonClass = '',
  iconOnly = false
}: MotionTeaserProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={buttonClass || "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-[#efbd3b] hover:bg-white/10 hover:text-[#ffd66a]"}
        aria-label="Play SOAR 2026 cinematic teaser"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-[#efbd3b] text-[#062d31]">
          <Play className="size-3.5 fill-current ml-0.5" />
        </span>
        {!iconOnly && <span>{buttonText}</span>}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-xl animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-[#efbd3b]/30 bg-[#062d31] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#031d27] px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-[#efbd3b] animate-ping" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#efbd3b]">
                  SOAR 2026 Official Motion Creative
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="rounded-full border border-white/10 p-2 text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                >
                  {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-white/10 p-2 text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label="Close video"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <video
                src="/soar-2026-motion.mp4"
                autoPlay
                playsInline
                controls
                muted={isMuted}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Bottom Caption */}
            <div className="bg-[#062d31] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/60">
              <p>
                <strong className="text-white">Higher Together</strong> · Mountain of Fire and Miracles Ministries Youth Ministry
              </p>
              <span className="text-[#ffd66a] font-semibold">10–13 December 2026 · MFM Prayer City</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
