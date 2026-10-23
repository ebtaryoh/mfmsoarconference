'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Share2, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Sparkles, 
  Shield, 
  Check, 
  Image as ImageIcon,
  Smartphone,
  Square
} from 'lucide-react'
import { CONFERENCE_INFO } from '@/lib/conference-data'

type PosterTemplate = 'teal_gold' | 'crimson_flame' | 'midnight_minimal'
type AspectRatio = 'square' | 'story'

export default function AttendPosterStudioPage() {
  const [attendeeName, setAttendeeName] = useState('Emmanuel Adeyemi')
  const [roleOrCampus, setRoleOrCampus] = useState('UNILAG Campus Fellowship')
  const [template, setTemplate] = useState<PosterTemplate>('teal_gold')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('square')
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  
  // Transform controls
  const [scale, setScale] = useState(1.1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [isRendering, setIsRendering] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load a default avatar if none uploaded
  useEffect(() => {
    // Generate an initial demo portrait
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImageSrc(img.src)
    }
    // Default placeholder
    img.src = '/placeholder-user.jpg'
  }, [])

  // Handle local file upload
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = event => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string)
        setScale(1.0)
        setOffsetX(0)
        setOffsetY(0)
      }
    }
    reader.readAsDataURL(file)
  }

  // Draw Poster on Canvas
  useEffect(() => {
    renderCanvas()
  }, [imageSrc, attendeeName, roleOrCampus, template, aspectRatio, scale, offsetX, offsetY])

  function renderCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = aspectRatio === 'square' ? 1080 : 1080
    const height = aspectRatio === 'square' ? 1080 : 1920

    canvas.width = width
    canvas.height = height

    // 1. Draw Background
    let bgGrad = ctx.createLinearGradient(0, 0, width, height)
    if (template === 'teal_gold') {
      bgGrad.addColorStop(0, '#041d24')
      bgGrad.addColorStop(0.5, '#062d31')
      bgGrad.addColorStop(1, '#02141a')
    } else if (template === 'crimson_flame') {
      bgGrad.addColorStop(0, '#8d210f')
      bgGrad.addColorStop(0.5, '#450a0a')
      bgGrad.addColorStop(1, '#062d31')
    } else {
      bgGrad.addColorStop(0, '#031d27')
      bgGrad.addColorStop(0.6, '#062d31')
      bgGrad.addColorStop(1, '#0b3b3e')
    }
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // 2. Draw User Photo (in designated portrait area)
    if (imageSrc) {
      const userImg = new Image()
      userImg.onload = () => {
        ctx.save()
        
        // Define photo clip area
        const photoX = aspectRatio === 'square' ? 160 : 140
        const photoY = aspectRatio === 'square' ? 220 : 340
        const photoW = aspectRatio === 'square' ? 760 : 800
        const photoH = aspectRatio === 'square' ? 560 : 880

        // Rounded clipping region
        ctx.beginPath()
        ctx.roundRect(photoX, photoY, photoW, photoH, 32)
        ctx.clip()

        // Background behind photo
        ctx.fillStyle = '#062d31'
        ctx.fillRect(photoX, photoY, photoW, photoH)

        // Draw and scale photo centered
        const userAspect = userImg.width / userImg.height
        const targetAspect = photoW / photoH
        let renderW = photoW * scale
        let renderH = photoH * scale

        if (userAspect > targetAspect) {
          renderW = renderH * userAspect
        } else {
          renderH = renderW / userAspect
        }

        const drawX = photoX + (photoW - renderW) / 2 + offsetX
        const drawY = photoY + (photoH - renderH) / 2 + offsetY
        ctx.drawImage(userImg, drawX, drawY, renderW, renderH)

        ctx.restore()

        // Photo golden frame stroke
        ctx.strokeStyle = '#efbd3b'
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.roundRect(photoX, photoY, photoW, photoH, 32)
        ctx.stroke()

        // 3. Draw Typography & Overlays
        drawOverlayDecorations(ctx, width, height)
      }
      userImg.src = imageSrc
    } else {
      drawOverlayDecorations(ctx, width, height)
    }
  }

  function drawOverlayDecorations(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const isSquare = aspectRatio === 'square'

    // Gold Outer Border
    ctx.strokeStyle = '#efbd3b'
    ctx.lineWidth = 14
    ctx.strokeRect(25, 25, width - 50, height - 50)

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 2
    ctx.strokeRect(38, 38, width - 76, height - 76)

    // TOP BANNER
    ctx.fillStyle = '#efbd3b'
    ctx.font = 'bold 22px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('MOUNTAIN OF FIRE AND MIRACLES MINISTRIES', width / 2, isSquare ? 80 : 120)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 18px sans-serif'
    ctx.fillText('YOUTH MINISTRY NATIONAL CONVOCATION', width / 2, isSquare ? 112 : 160)

    // SOAR 2026 LOGO & THEME
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 64px sans-serif'
    ctx.fillText('SOAR 2026', width / 2, isSquare ? 175 : 240)

    ctx.fillStyle = '#ffd66a'
    ctx.font = 'italic 30px serif'
    ctx.fillText('Higher Together', width / 2, isSquare ? 208 : 285)

    // ATTENDEE BADGE PILL OVER PHOTO
    const pillY = isSquare ? 750 : 1180
    ctx.fillStyle = '#8d210f'
    ctx.beginPath()
    ctx.roundRect(width / 2 - 200, pillY, 400, 54, 27)
    ctx.fill()
    ctx.strokeStyle = '#ffd66a'
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 22px sans-serif'
    ctx.fillText('🦅 I WILL BE ATTENDING', width / 2, pillY + 35)

    // ATTENDEE NAME
    const nameY = isSquare ? 860 : 1330
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 52px sans-serif'
    ctx.fillText(attendeeName.toUpperCase(), width / 2, nameY)

    // CAMPUS / ROLE
    ctx.fillStyle = '#ffd66a'
    ctx.font = 'bold 26px sans-serif'
    ctx.fillText(roleOrCampus, width / 2, nameY + 45)

    // FOOTER DETAILS: DATES & VENUE
    const footerY = isSquare ? 975 : 1540
    ctx.strokeStyle = 'rgba(239, 189, 59, 0.4)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(120, footerY)
    ctx.lineTo(width - 120, footerY)
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText('10–13 DECEMBER 2026', width / 2, footerY + 45)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '22px sans-serif'
    ctx.fillText('MFM Prayer City, KM 12 Lagos–Ibadan Expressway', width / 2, footerY + 80)

    if (!isSquare) {
      // Extra details for story
      ctx.fillStyle = '#ffd66a'
      ctx.font = 'italic 22px serif'
      ctx.fillText('"They that wait upon the Lord shall mount up with wings as eagles"', width / 2, 1720)

      ctx.fillStyle = '#efbd3b'
      ctx.font = 'bold 20px sans-serif'
      ctx.fillText('REGISTER FOR FREE: soar2026.mfmyouth.org', width / 2, 1780)
    }
  }

  // Download high-resolution PNG
  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    setIsRendering(true)

    const link = document.createElement('a')
    link.download = `SOAR-2026-Attending-${attendeeName.replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsRendering(false)
  }

  // Share to WhatsApp
  function handleWhatsAppShare() {
    const msg = encodeURIComponent(
      `🦅 I will be attending SOAR 2026: Higher Together!\n\n` +
      `Date: 10–13 December 2026\n` +
      `Venue: MFM Prayer City, KM 12 Lagos–Ibadan Expressway\n` +
      `Delegate: ${attendeeName} (${roleOrCampus})\n\n` +
      `Create your attendance flyer & register for free at: https://soar2026.mfmyouth.org`
    )
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  return (
    <main className="min-h-screen bg-[#041d24] px-4 py-8 text-[#f4efe4] selection:bg-[#efbd3b] selection:text-[#062d31] sm:px-6 lg:px-8">
      {/* Top Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-white/10 pb-5">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition"
        >
          <ArrowLeft className="size-4" />
          <span>Back to SOAR 2026</span>
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#efbd3b]" />
          <span className="text-xs font-black uppercase tracking-wider text-[#ffd66a]">
            Attendance Poster Studio
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl py-10 sm:py-14">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#efbd3b]">
            Social DP & Status Generator
          </span>
          <h1 className="mt-2 text-4xl sm:text-5xl font-black text-white tracking-tight">
            &quot;I Will Be <span className="font-serif font-normal italic text-[#ffd66a]">Attending&quot;</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-white/65 max-w-xl">
            Personalize your official conference flyer. All processing happens 100% locally in your browser to respect your photo privacy.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Controls Panel (Cols 1-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#062d31] p-6 text-white space-y-5 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#efbd3b]">
                1. Personal Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Your Display Name
                </label>
                <input
                  type="text"
                  value={attendeeName}
                  onChange={e => setAttendeeName(e.target.value)}
                  placeholder="e.g. Emmanuel Adeyemi"
                  className="w-full rounded-xl border border-white/15 bg-[#041d24] px-4 py-3 text-xs text-white focus:border-[#efbd3b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Campus Fellowship / Unit / Role
                </label>
                <input
                  type="text"
                  value={roleOrCampus}
                  onChange={e => setRoleOrCampus(e.target.value)}
                  placeholder="e.g. UNILAG Fellowship or Youth Pastor"
                  className="w-full rounded-xl border border-white/15 bg-[#041d24] px-4 py-3 text-xs text-white focus:border-[#efbd3b] focus:outline-none"
                />
              </div>

              {/* Upload photo */}
              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">
                  Upload Your Portrait
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#efbd3b]/50 bg-[#041d24] py-4 text-xs font-bold text-[#efbd3b] hover:bg-[#0b3b3e] transition"
                >
                  <Upload className="size-4" />
                  <span>Choose Photo from Device</span>
                </button>
              </div>

              {/* Photo Transform adjustments */}
              <div className="rounded-2xl border border-white/10 bg-[#041d24]/80 p-4 space-y-3">
                <span className="text-[11px] font-bold text-white/60 block">Photo Position & Zoom</span>
                
                <div className="flex items-center gap-3 text-xs">
                  <ZoomOut className="size-4 text-white/40" />
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={scale}
                    onChange={e => setScale(parseFloat(e.target.value))}
                    className="w-full accent-[#efbd3b]"
                  />
                  <ZoomIn className="size-4 text-white/40" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-white/50 block mb-1">Pan Left / Right</label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={offsetX}
                      onChange={e => setOffsetX(parseInt(e.target.value))}
                      className="w-full accent-[#efbd3b]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 block mb-1">Pan Up / Down</label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={offsetY}
                      onChange={e => setOffsetY(parseInt(e.target.value))}
                      className="w-full accent-[#efbd3b]"
                    />
                  </div>
                </div>
              </div>

              {/* Aspect Ratio Toggle */}
              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">
                  Format / Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('square')}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                      aspectRatio === 'square'
                        ? 'border-[#efbd3b] bg-[#efbd3b] text-[#062d31]'
                        : 'border-white/15 bg-[#041d24] text-white/70 hover:text-white'
                    }`}
                  >
                    <Square className="size-4" />
                    <span>Square (1:1 Feed)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio('story')}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                      aspectRatio === 'story'
                        ? 'border-[#efbd3b] bg-[#efbd3b] text-[#062d31]'
                        : 'border-white/15 bg-[#041d24] text-white/70 hover:text-white'
                    }`}
                  >
                    <Smartphone className="size-4" />
                    <span>Story (9:16 DP)</span>
                  </button>
                </div>
              </div>

              {/* Template Style */}
              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">
                  Theme Palette
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'teal_gold', label: 'Deep Teal' },
                    { id: 'crimson_flame', label: 'Crimson Fire' },
                    { id: 'midnight_minimal', label: 'Midnight' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTemplate(t.id as PosterTemplate)}
                      className={`rounded-xl border p-2.5 text-center text-[11px] font-bold transition ${
                        template === t.id
                          ? 'border-[#efbd3b] bg-[#0b3b3e] text-[#ffd66a]'
                          : 'border-white/10 bg-[#041d24] text-white/60 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isRendering}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffd66a] via-[#efbd3b] to-[#d49a1d] py-4 text-xs font-black text-[#062d31] shadow-xl hover:brightness-110 active:scale-98 transition"
                >
                  <Download className="size-4" />
                  <span>Download High-Res Poster (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 py-3 text-xs font-bold text-white hover:border-[#25D366] hover:text-[#25D366] transition"
                >
                  <Share2 className="size-4" />
                  <span>Share Announcement via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Privacy Guarantee */}
            <div className="rounded-2xl border border-white/10 bg-[#041d24]/60 p-4 text-[11px] text-white/50 flex items-start gap-3">
              <Shield className="size-4 text-[#22c55e] shrink-0 mt-0.5" />
              <span>
                <strong>Zero Server Storage:</strong> Your photo is never uploaded to any external server or database. The poster renders 100% on your device using client-side Canvas.
              </span>
            </div>
          </div>

          {/* Canvas Live Preview (Cols 6-12) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-md overflow-hidden rounded-3xl border-4 border-[#efbd3b]/50 bg-[#062d31] shadow-2xl p-2">
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-2xl block object-contain shadow-inner"
              />
            </div>
            <p className="mt-3 text-xs text-white/40 text-center">
              Live high-resolution preview · Click &apos;Download High-Res Poster&apos; to save full print size.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
