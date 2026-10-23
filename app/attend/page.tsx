'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Share2, 
  RotateCw, 
  FlipHorizontal,
  ZoomIn, 
  ZoomOut, 
  Move, 
  Sparkles, 
  Check, 
  Image as ImageIcon,
  Smartphone,
  Eye,
  Camera,
  MessageCircle
} from 'lucide-react'
import { CONFERENCE_INFO } from '@/lib/conference-data'

export default function AttendPosterStudioPage() {
  const [attendeeName, setAttendeeName] = useState('Pastor Emmanuel Adeyemi')
  const [roleOrCampus, setRoleOrCampus] = useState('UNILAG Campus Fellowship')
  const [showNameBadge, setShowNameBadge] = useState(true)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  
  // Transform & adjustments
  const [scale, setScale] = useState(1.1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [isRendering, setIsRendering] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  // Drag state for touch and mouse
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0, initOffsetX: 0, initOffsetY: 0 })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const templateImgRef = useRef<HTMLImageElement | null>(null)

  // Load the exact official SOAR 2026 Poster Template
  useEffect(() => {
    const tImg = new Image()
    tImg.crossOrigin = 'anonymous'
    tImg.onload = () => {
      templateImgRef.current = tImg
      renderPoster()
    }
    tImg.src = '/posters/soar-2026-custom-poster-template.png'

    // Load initial sample avatar
    const defaultUserImg = new Image()
    defaultUserImg.crossOrigin = 'anonymous'
    defaultUserImg.onload = () => {
      setImageSrc(defaultUserImg.src)
    }
    defaultUserImg.src = '/merch/soar-merch-1.jpg'
  }, [])

  // Handle local file upload (works on iPhone camera/photos & Android file picker)
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = event => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string)
        setScale(1.1)
        setOffsetX(0)
        setOffsetY(0)
        setRotation(0)
        setFlipH(false)
      }
    }
    reader.readAsDataURL(file)
  }

  // Draw the high-resolution composite poster
  const renderPoster = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const templateImg = templateImgRef.current
    if (!templateImg) return

    // Template dimensions: 1024 x 1536
    const canvasW = 1024
    const canvasH = 1536
    canvas.width = canvasW
    canvas.height = canvasH

    // 1. Draw Official Background Template Artwork
    ctx.drawImage(templateImg, 0, 0, canvasW, canvasH)

    // Center coordinates for the golden circle frame
    const cx = 492
    const cy = 648
    const rx = 205
    const ry = 222

    // 2. Draw User Photo inside the golden frame
    if (imageSrc) {
      const userImg = new Image()
      userImg.crossOrigin = 'anonymous'
      userImg.onload = () => {
        // Clip to the golden circle
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()

        // Background behind user photo in case it's transparent
        ctx.fillStyle = '#062d31'
        ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2)

        // Apply transformations (Pan, Zoom, Rotation, Flip)
        ctx.translate(cx + offsetX, cy + offsetY)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.scale(scale * (flipH ? -1 : 1), scale)

        // Calculate aspect ratio covering
        const userAspect = userImg.width / userImg.height
        const targetAspect = rx / ry
        let drawW = rx * 2
        let drawH = ry * 2

        if (userAspect > targetAspect) {
          drawW = drawH * userAspect
        } else {
          drawH = drawW / userAspect
        }

        ctx.drawImage(userImg, -drawW / 2, -drawH / 2, drawW, drawH)
        ctx.restore()

        // 3. Draw Polished Metallic Gold Ring Bevel
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
        ctx.lineWidth = 14
        const goldGrad = ctx.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry)
        goldGrad.addColorStop(0, '#ffd66a')
        goldGrad.addColorStop(0.25, '#efbd3b')
        goldGrad.addColorStop(0.5, '#ffe28a')
        goldGrad.addColorStop(0.75, '#b8860b')
        goldGrad.addColorStop(1, '#ffd66a')
        ctx.strokeStyle = goldGrad
        ctx.stroke()
        ctx.restore()

        // 4. Draw Custom Attendee Name & Role Badge (if enabled)
        if (showNameBadge && attendeeName.trim()) {
          drawNameBadge(ctx, cx, cy, rx, ry)
        }
      }
      userImg.src = imageSrc
    }
  }, [imageSrc, scale, offsetX, offsetY, rotation, flipH, showNameBadge, attendeeName, roleOrCampus])

  useEffect(() => {
    renderPoster()
  }, [renderPoster])

  // Custom Name & Campus Badge overlaid on bottom of circular frame
  function drawNameBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number) {
    const badgeY = cy + ry - 42
    const badgeW = 380
    const badgeH = 68
    const badgeX = cx - badgeW / 2

    ctx.save()
    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
    ctx.shadowBlur = 12
    ctx.shadowOffsetY = 4

    // Badge pill background (Crimson & Gold)
    ctx.fillStyle = '#8d210f'
    ctx.beginPath()
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 34)
    ctx.fill()

    // Gold border
    ctx.strokeStyle = '#ffd66a'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.restore()

    // Name text
    ctx.save()
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 24px sans-serif'
    const nameText = attendeeName.length > 24 ? attendeeName.substring(0, 24) + '...' : attendeeName
    ctx.fillText(nameText.toUpperCase(), cx, badgeY + 30)

    // Role / Campus text
    if (roleOrCampus.trim()) {
      ctx.fillStyle = '#ffd66a'
      ctx.font = '600 15px sans-serif'
      const roleText = roleOrCampus.length > 30 ? roleOrCampus.substring(0, 30) + '...' : roleOrCampus
      ctx.fillText(roleText, cx, badgeY + 52)
    }
    ctx.restore()
  }

  // Pointer & Touch handlers for dragging on iPhone, Android, and Desktop
  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.setPointerCapture(e.pointerId)
    isDraggingRef.current = true
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initOffsetX: offsetX,
      initOffsetY: offsetY
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setOffsetX(dragStartRef.current.initOffsetX + dx * 1.5)
    setOffsetY(dragStartRef.current.initOffsetY + dy * 1.5)
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    isDraggingRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Ignore if pointer capture released automatically
    }
  }

  // Reset transforms
  function handleReset() {
    setScale(1.1)
    setOffsetX(0)
    setOffsetY(0)
    setRotation(0)
    setFlipH(false)
  }

  // Download high-resolution PNG (Compatible with iOS & Android)
  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    setIsRendering(true)

    canvas.toBlob(blob => {
      setIsRendering(false)
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeName = attendeeName.replace(/[^a-zA-Z0-9]/g, '_') || 'Attendee'
      a.download = `SOAR_2026_${safeName}_Poster.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3500)
    }, 'image/png', 1.0)
  }

  // Native Web Share API (Flawless for iOS Safari and Android Chrome)
  async function handleShare() {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob(async blob => {
      if (!blob) return
      const file = new File([blob], 'SOAR_2026_Poster.png', { type: 'image/png' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'SOAR 2026 — Higher Together',
            text: `I will be attending the SOAR 2026 Youth Conference at MFM Prayer City! Join me: ${CONFERENCE_INFO.website}`,
            files: [file]
          })
          return
        } catch {
          // Fall back to direct WhatsApp link if user cancelled share sheet
        }
      }

      // Fallback: WhatsApp share link
      const text = encodeURIComponent(
        `🦅 *I WILL BE ATTENDING SOAR 2026!* 🦅\n\nTheme: *Higher Together*\nDate: 10th – 13th December 2026\nVenue: MFM Prayer City, KM 12 Lagos-Ibadan Expressway.\n\nRegister for free and get your digital pass here: ${CONFERENCE_INFO.website}`
      )
      window.open(`https://wa.me/?text=${text}`, '_blank')
    }, 'image/png', 1.0)
  }

  return (
    <div className="min-h-screen bg-[#041d24] text-white selection:bg-[#efbd3b] selection:text-[#041d24]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-[#efbd3b]/20 bg-[#041d24]/90 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-[#efbd3b]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#efbd3b]/10 px-3 py-1 text-xs font-bold text-[#efbd3b] border border-[#efbd3b]/20">
              <Sparkles className="mr-1 h-3 w-3" />
              Official Poster Studio
            </span>
          </div>
        </div>
      </header>

      {/* Main Studio Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            "I Will Be Attending" <span className="text-[#efbd3b]">Custom Poster</span>
          </h1>
          <p className="mt-2 text-sm text-white/70 sm:text-base max-w-2xl">
            Create your official personalized SOAR 2026 conference flyer. Drag, zoom, and adjust your portrait inside the golden eagle crest. Optimized for both iPhone & Android.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* LEFT: Live Interactive Poster Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-[460px] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#efbd3b]/30 bg-[#021318]">
              {/* Interactive Canvas */}
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="w-full h-auto cursor-grab active:cursor-grabbing touch-none select-none"
                style={{ aspectRatio: '1024 / 1536' }}
              />

              {/* Floating Gesture Hint */}
              <div className="absolute top-3 left-3 bg-[#041d24]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white/90 flex items-center gap-1.5 shadow-lg pointer-events-none">
                <Move className="h-3.5 w-3.5 text-[#efbd3b]" />
                <span>Drag to reposition photo</span>
              </div>
            </div>

            {/* Quick Presets Bar under Canvas */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setScale(s => Math.min(3.0, s + 0.15))}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#062d31] px-3 py-2 text-xs font-semibold text-white/90 hover:bg-[#083c41] border border-white/10 active:scale-95 transition-transform"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4 text-[#efbd3b]" />
                <span>Zoom In</span>
              </button>
              <button
                type="button"
                onClick={() => setScale(s => Math.max(0.4, s - 0.15))}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#062d31] px-3 py-2 text-xs font-semibold text-white/90 hover:bg-[#083c41] border border-white/10 active:scale-95 transition-transform"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4 text-[#efbd3b]" />
                <span>Zoom Out</span>
              </button>
              <button
                type="button"
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#062d31] px-3 py-2 text-xs font-semibold text-white/90 hover:bg-[#083c41] border border-white/10 active:scale-95 transition-transform"
                title="Rotate 90 degrees"
              >
                <RotateCw className="h-4 w-4 text-[#efbd3b]" />
                <span>Rotate</span>
              </button>
              <button
                type="button"
                onClick={() => setFlipH(f => !f)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#062d31] px-3 py-2 text-xs font-semibold text-white/90 hover:bg-[#083c41] border border-white/10 active:scale-95 transition-transform"
                title="Flip Horizontal"
              >
                <FlipHorizontal className="h-4 w-4 text-[#efbd3b]" />
                <span>Flip</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#062d31] px-3 py-2 text-xs font-semibold text-white/70 hover:bg-[#083c41] border border-white/10 active:scale-95 transition-transform"
              >
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Controls & Customization Form */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step 1: Upload Photo Card */}
            <div className="rounded-2xl border border-white/10 bg-[#062d31]/40 backdrop-blur-md p-5 sm:p-6 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                <Camera className="h-5 w-5 text-[#efbd3b]" />
                <span>1. Select Your Photo</span>
              </h2>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="poster-photo-input"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#efbd3b]/40 bg-[#041d24]/60 p-6 text-center hover:border-[#efbd3b] hover:bg-[#041d24]/90 transition-all group"
              >
                <div className="rounded-full bg-[#efbd3b]/10 p-3 text-[#efbd3b] group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Tap to Upload Photo
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    Works with iPhone Camera, Gallery, and Android Files (PNG, JPG, HEIC)
                  </p>
                </div>
              </button>
            </div>

            {/* Step 2: Fine-Tuning Sliders */}
            <div className="rounded-2xl border border-white/10 bg-[#062d31]/40 backdrop-blur-md p-5 sm:p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Move className="h-5 w-5 text-[#efbd3b]" />
                <span>2. Fine-Tune Position & Zoom</span>
              </h2>

              {/* Zoom Slider */}
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Zoom / Scale</span>
                  <span className="font-mono text-[#efbd3b]">{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.05"
                  value={scale}
                  onChange={e => setScale(parseFloat(e.target.value))}
                  className="w-full accent-[#efbd3b] cursor-pointer"
                />
              </div>

              {/* Horizontal Position */}
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Horizontal Pan</span>
                  <span className="font-mono text-[#efbd3b]">{Math.round(offsetX)}px</span>
                </div>
                <input
                  type="range"
                  min="-250"
                  max="250"
                  step="2"
                  value={offsetX}
                  onChange={e => setOffsetX(parseInt(e.target.value, 10))}
                  className="w-full accent-[#efbd3b] cursor-pointer"
                />
              </div>

              {/* Vertical Position */}
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Vertical Pan</span>
                  <span className="font-mono text-[#efbd3b]">{Math.round(offsetY)}px</span>
                </div>
                <input
                  type="range"
                  min="-250"
                  max="250"
                  step="2"
                  value={offsetY}
                  onChange={e => setOffsetY(parseInt(e.target.value, 10))}
                  className="w-full accent-[#efbd3b] cursor-pointer"
                />
              </div>

              {/* Rotation Slider */}
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Rotation</span>
                  <span className="font-mono text-[#efbd3b]">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="2"
                  value={rotation}
                  onChange={e => setRotation(parseInt(e.target.value, 10))}
                  className="w-full accent-[#efbd3b] cursor-pointer"
                />
              </div>
            </div>

            {/* Step 3: Name & Fellowship Customization */}
            <div className="rounded-2xl border border-white/10 bg-[#062d31]/40 backdrop-blur-md p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#efbd3b]" />
                  <span>3. Attendee Badge Details</span>
                </h2>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#efbd3b]">
                  <input
                    type="checkbox"
                    checked={showNameBadge}
                    onChange={e => setShowNameBadge(e.target.checked)}
                    className="rounded accent-[#efbd3b]"
                  />
                  <span>Show Name Badge</span>
                </label>
              </div>

              {showNameBadge && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Full Name / Title
                    </label>
                    <input
                      type="text"
                      value={attendeeName}
                      onChange={e => setAttendeeName(e.target.value)}
                      placeholder="e.g. Pastor Emmanuel Adeyemi"
                      maxLength={32}
                      className="w-full rounded-lg border border-white/10 bg-[#041d24] px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#efbd3b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Campus Fellowship / Directorate
                    </label>
                    <input
                      type="text"
                      value={roleOrCampus}
                      onChange={e => setRoleOrCampus(e.target.value)}
                      placeholder="e.g. UNILAG Campus Fellowship"
                      maxLength={40}
                      className="w-full rounded-lg border border-white/10 bg-[#041d24] px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#efbd3b] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Export & Share Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isRendering}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#efbd3b] to-[#ffd66a] px-6 py-4 text-base font-bold text-[#041d24] shadow-lg hover:brightness-110 active:scale-[0.99] transition-all"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="h-5 w-5 text-emerald-900" />
                    <span>Poster Saved Successfully!</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Download High-Resolution Poster</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#20ba59] active:scale-[0.99] transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Share to WhatsApp & Instagram Stories</span>
              </button>

              <p className="text-center text-xs text-white/50">
                1024 × 1536 PNG High-Definition Print & Story Quality. Fully compatible with iPhone Photos & Android Gallery.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
