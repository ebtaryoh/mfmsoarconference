'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  ScanLine, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Camera, 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff,
  Search, 
  RefreshCw, 
  User, 
  Ticket, 
  ArrowRight,
  ShieldCheck,
  DoorOpen,
  CloudDownload,
  UploadCloud,
  Clock,
  Layers
} from 'lucide-react'
import { 
  downloadAndCacheManifest, 
  localOfflineValidate, 
  getPendingScanCount, 
  syncPendingScans 
} from '@/lib/offline/offline-scanner'
import { checkInAttendee } from '@/lib/storage'
import { Attendee } from '@/lib/types'

export default function UsherScannerPage() {
  const [cameraActive, setCameraActive] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedGate, setSelectedGate] = useState('Gate 1 (Main Concourse)')
  const [manualCode, setManualCode] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  // Offline Engine State
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [manifestReady, setManifestReady] = useState(false)
  const [manifestCount, setManifestCount] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [syncStatus, setSyncStatus] = useState('')

  // Scan Outcome
  const [scanResult, setScanResult] = useState<{
    status: 'idle' | 'success' | 'warning' | 'error'
    message: string
    attendeeName?: string
    role?: string
    unit?: string
    timestamp?: string
    latencyMs?: number
  }>({
    status: 'idle',
    message: 'Position attendee QR code inside the viewfinder target.'
  })

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    updatePendingBadge()
  }, [])

  async function updatePendingBadge() {
    const count = await getPendingScanCount()
    setPendingCount(count)
  }

  // Pre-download signed manifest
  async function handleDownloadManifest() {
    try {
      setSyncStatus('Downloading signed validation manifest from server...')
      const res = await downloadAndCacheManifest('soar-2026')
      setManifestReady(true)
      setManifestCount(res.cachedCount)
      setSyncStatus(`Offline manifest ready: ${res.cachedCount} credentials cached. Sub-50ms offline scanning enabled.`)
      setTimeout(() => setSyncStatus(''), 4500)
    } catch (err: any) {
      setSyncStatus(`Failed to download manifest: ${err.message}`)
    }
  }

  // Sync queued scans
  async function handleFlushSync() {
    try {
      setSyncStatus('Synchronizing offline queue with central turnstile database...')
      const res = await syncPendingScans('usher_device_01')
      setSyncStatus(res.message)
      await updatePendingBadge()
      setTimeout(() => setSyncStatus(''), 4000)
    } catch (err: any) {
      setSyncStatus(`Sync error: ${err.message}`)
    }
  }

  // Toggle Camera
  async function toggleCamera() {
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
        videoRef.current.srcObject = null
      }
      setCameraActive(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
        setCameraActive(true)
      } catch {
        setCameraActive(true)
      }
    }
  }

  // Audio feedback cues
  function playAudioCue(type: 'success' | 'warning' | 'error') {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.connect(gain)
      gain.connect(audioCtx.destination)

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime)
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1)
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.25)
      } else if (type === 'warning') {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime)
        osc.frequency.setValueAtTime(370, audioCtx.currentTime + 0.15)
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.35)
      } else {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime)
        osc.frequency.setValueAtTime(160, audioCtx.currentTime + 0.15)
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.35)
      }
    } catch {
      // AudioContext unavailable
    }
  }

  async function processScan(code: string) {
    const raw = code.trim().toUpperCase()
    if (!raw) return

    setIsScanning(true)

    // Check merchandise voucher diversion
    if (raw.startsWith('VOUCH') || raw.startsWith('ORD-')) {
      playAudioCue('warning')
      setScanResult({
        status: 'warning',
        message: 'This is a MERCHANDISE PICKUP VOUCHER, not an admission pass! Please redirect delegate to Booth 4 (Youth Pavilion).'
      })
      setIsScanning(false)
      return
    }

    // IF OFFLINE MODE IS ENABLED: use sub-50ms IndexedDB engine!
    if (isOfflineMode) {
      const offlineRes = await localOfflineValidate(raw, selectedGate)
      await updatePendingBadge()

      if (offlineRes.status === 'granted') {
        playAudioCue('success')
        setScanResult({
          status: 'success',
          message: `VALID ADMISSION PASS. Access granted for ${offlineRes.attendeeName} (Validated locally in ${offlineRes.durationMs}ms).`,
          attendeeName: offlineRes.attendeeName,
          role: offlineRes.category,
          latencyMs: offlineRes.durationMs,
          timestamp: new Date().toLocaleTimeString()
        })
      } else if (offlineRes.status === 'already_scanned_locally') {
        playAudioCue('warning')
        setScanResult({
          status: 'warning',
          message: `ALREADY SCANNED! Ticket was already checked in on this device during the current session.`,
          attendeeName: offlineRes.attendeeName,
          role: offlineRes.category,
          latencyMs: offlineRes.durationMs,
          timestamp: new Date().toLocaleTimeString()
        })
      } else {
        playAudioCue('error')
        setScanResult({
          status: 'error',
          message: `INVALID PASS: Reference "${raw}" not found in offline manifest cache.`,
          latencyMs: offlineRes.durationMs
        })
      }
      setIsScanning(false)
      return
    }

    // ONLINE SERVER VALIDATION
    try {
      const startT = performance.now()
      const res = await fetch('/api/v1/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketCodeOrRef: raw,
          gateName: selectedGate,
          usherUserId: 'Usher Station 01'
        })
      })
      const latencyMs = Number((performance.now() - startT).toFixed(1))
      const data = await res.json()

      if (res.ok && data.status === 'granted') {
        playAudioCue('success')
        setScanResult({
          status: 'success',
          message: data.message,
          attendeeName: data.attendee?.fullName,
          role: data.attendee?.roleCategory || data.attendee?.role,
          unit: data.attendee?.unitOrCampus,
          timestamp: data.checkedInAt ? new Date(data.checkedInAt).toLocaleTimeString() : new Date().toLocaleTimeString(),
          latencyMs
        })
      } else if (data.status === 'already_checked_in') {
        playAudioCue('warning')
        setScanResult({
          status: 'warning',
          message: data.message,
          attendeeName: data.attendee?.fullName,
          role: data.attendee?.roleCategory || data.attendee?.role,
          unit: data.attendee?.unitOrCampus,
          timestamp: data.checkedInAt ? new Date(data.checkedInAt).toLocaleTimeString() : new Date().toLocaleTimeString(),
          latencyMs
        })
      } else {
        playAudioCue('error')
        setScanResult({
          status: 'error',
          message: data.message || 'Invalid or revoked pass.',
          latencyMs
        })
      }
    } catch {
      // Fallback to local offline check if network dropped
      setIsOfflineMode(true)
      setSyncStatus('Network dropped! Automatically switched to Offline Scanner Engine.')
      processScan(code)
    }

    setIsScanning(false)
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault()
    processScan(manualCode)
    setManualCode('')
  }

  const quickTestRefs = [
    { label: 'Emmanuel Adeyemi (Valid / UNILAG)', ref: 'SOAR-2026-7842-AX' },
    { label: 'David Balogun (Valid / OAU)', ref: 'SOAR-2026-5519-TX' },
    { label: 'Merchandise Voucher (Booth 4)', ref: 'VOUCH-SOAR-339182' },
    { label: 'Invalid Pass Token', ref: 'SOAR-2026-INVALID-TOKEN' }
  ]

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className={`flex size-2 rounded-full ${isOfflineMode ? 'bg-[#eab308]' : 'bg-[#22c55e] animate-ping'}`} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#ffd66a]">
              {isOfflineMode ? 'Offline Manifest Engine Active' : 'Online Mesh Node Connected'}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">Usher QR Scanner</h1>
          <p className="text-xs text-white/60">
            Accredit arriving attendees, verify turnstile credentials, and prevent duplicate check-ins.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
              isOfflineMode 
                ? 'border-[#eab308] bg-[#eab308]/20 text-[#fde047]' 
                : 'border-white/15 bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            {isOfflineMode ? <WifiOff className="size-3.5" /> : <Wifi className="size-3.5" />}
            <span>{isOfflineMode ? 'Offline Mode' : 'Online Mode'}</span>
          </button>

          <select
            value={selectedGate}
            onChange={e => setSelectedGate(e.target.value)}
            className="rounded-xl border border-white/15 bg-[#062d31] px-3 py-2 text-xs font-bold text-white focus:border-[#efbd3b] focus:outline-none"
          >
            <option>Gate 1 (Main Concourse)</option>
            <option>Gate 2 (Campus Shuttles Plaza)</option>
            <option>Gate 4 (Ministers VIP Protocol)</option>
          </select>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`rounded-xl border p-2 text-xs transition ${
              soundEnabled ? 'border-[#efbd3b] text-[#efbd3b]' : 'border-white/10 text-white/40'
            }`}
            aria-label={soundEnabled ? 'Disable audio' : 'Enable audio'}
          >
            {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </button>
        </div>
      </div>

      {/* Offline Sync Controls Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#062d31] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-4 text-[#efbd3b]" />
          <div>
            <span className="font-bold text-white">Offline Cache: </span>
            <span className="text-white/60 font-mono">
              {manifestReady ? `${manifestCount} credentials signed` : 'Manifest not downloaded'}
            </span>
            {pendingCount > 0 && (
              <span className="ml-3 rounded-full bg-[#efbd3b] px-2 py-0.5 text-[10px] font-mono font-black text-[#062d31]">
                {pendingCount} scans pending sync
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadManifest}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-white/10"
          >
            <CloudDownload className="size-3.5 text-[#efbd3b]" />
            <span>Pre-load Manifest</span>
          </button>

          {pendingCount > 0 && (
            <button
              onClick={handleFlushSync}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-[#22c55e] px-3.5 py-1.5 text-[11px] font-bold text-[#062d31] hover:bg-[#16a34a]"
            >
              <UploadCloud className="size-3.5" />
              <span>Sync {pendingCount} Scans</span>
            </button>
          )}
        </div>
      </div>

      {syncStatus && (
        <div className="rounded-xl bg-[#0b3b3e] border border-[#efbd3b]/30 p-3 text-xs font-mono text-[#ffd66a]">
          {syncStatus}
        </div>
      )}

      {/* Operational Limitation Banner for Staff */}
      <div className="rounded-2xl border border-white/10 bg-[#041d24] p-3.5 text-[11px] text-white/60 flex items-start gap-2.5">
        <AlertTriangle className="size-4 text-[#eab308] shrink-0 mt-0.5" />
        <div>
          <strong className="text-white/90">Venue Outage Staff Guidance:</strong>
          Two independent scanners operating without connectivity cannot communicate with each other in real-time. To prevent cross-lane pass re-use during outages, adhere to assigned entry lanes (Lane 1 vs Lane 2).
        </div>
      </div>

      {/* SCANNER VIEWPORT */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-[#efbd3b]/40 bg-[#062d31] shadow-2xl p-4 sm:p-6 text-center">
        {/* Status result banner over camera */}
        {scanResult.status !== 'idle' && (
          <div className={`mb-4 rounded-2xl p-4 text-left border flex items-start gap-3.5 animate-rise ${
            scanResult.status === 'success'
              ? 'border-[#22c55e] bg-[#22c55e]/20 text-[#22c55e]'
              : scanResult.status === 'warning'
              ? 'border-[#eab308] bg-[#eab308]/20 text-[#fde047]'
              : 'border-[#ef4444] bg-[#ef4444]/20 text-[#fca5a5]'
          }`}>
            {scanResult.status === 'success' && <CheckCircle2 className="size-6 shrink-0 mt-0.5" />}
            {scanResult.status === 'warning' && <AlertTriangle className="size-6 shrink-0 mt-0.5" />}
            {scanResult.status === 'error' && <XCircle className="size-6 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <strong className="block text-sm font-black">
                  {scanResult.status === 'success' && 'ACCESS GRANTED'}
                  {scanResult.status === 'warning' && 'WARNING / ACTION REQUIRED'}
                  {scanResult.status === 'error' && 'ACCESS DENIED'}
                </strong>
                {scanResult.latencyMs && (
                  <span className="text-[10px] font-mono opacity-70">
                    {scanResult.latencyMs}ms
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs leading-relaxed font-medium">
                {scanResult.message}
              </p>

              {scanResult.attendeeName && (
                <div className="mt-3 rounded-xl bg-black/40 p-3 text-xs text-white grid grid-cols-2 gap-2 border border-white/10">
                  <div>
                    <span className="text-white/40 text-[10px] uppercase">Attendee</span>
                    <p className="font-bold">{scanResult.attendeeName}</p>
                  </div>
                  <div>
                    <span className="text-white/40 text-[10px] uppercase">Category</span>
                    <p className="font-bold text-[#ffd66a]">{scanResult.role || 'Delegate'}</p>
                  </div>
                  {scanResult.unit && (
                    <div className="col-span-2">
                      <span className="text-white/40 text-[10px] uppercase">Campus Unit</span>
                      <p className="font-medium text-white/90">{scanResult.unit}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Viewfinder Area */}
        <div className="relative mx-auto aspect-square max-w-sm rounded-3xl border-2 border-dashed border-[#efbd3b]/60 bg-[#031d27] flex flex-col items-center justify-center p-6 overflow-hidden">
          {cameraActive ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="text-center p-4">
              <ScanLine className="size-16 text-[#efbd3b] mx-auto animate-pulse" />
              <p className="mt-4 text-xs font-bold text-white">Viewfinder Ready</p>
              <p className="text-[11px] text-white/50 mt-1 max-w-xs">
                Activate camera to scan physical badges, or click a quick simulator cue below.
              </p>
              <button
                type="button"
                onClick={toggleCamera}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#efbd3b] px-4 py-2 text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition"
              >
                <Camera className="size-3.5" />
                <span>Start Camera Scanner</span>
              </button>
            </div>
          )}

          {/* Crosshair corners */}
          <div className="pointer-events-none absolute inset-6 border border-white/20 rounded-2xl">
            <span className="absolute -top-1 -left-1 size-6 border-t-4 border-l-4 border-[#efbd3b]" />
            <span className="absolute -top-1 -right-1 size-6 border-t-4 border-r-4 border-[#efbd3b]" />
            <span className="absolute -bottom-1 -left-1 size-6 border-b-4 border-l-4 border-[#efbd3b]" />
            <span className="absolute -bottom-1 -right-1 size-6 border-b-4 border-r-4 border-[#efbd3b]" />
          </div>
        </div>

        {/* Quick Simulator Test Cues */}
        <div className="mt-6 border-t border-white/10 pt-4 text-left">
          <span className="text-[10px] font-mono uppercase text-[#efbd3b] tracking-wider block mb-2">
            Simulate Scan (Online or Offline Engine)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickTestRefs.map(item => (
              <button
                key={item.ref}
                onClick={() => processScan(item.ref)}
                className="rounded-xl border border-white/10 bg-[#041d24] p-2.5 text-left text-[11px] font-bold text-white hover:border-[#efbd3b] hover:bg-[#0b3b3e] transition"
              >
                <span className="block truncate">{item.label}</span>
                <span className="font-mono text-[9px] text-[#ffd66a]">{item.ref}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Code Input Fallback */}
        <form onSubmit={handleManualSubmit} className="mt-6 flex gap-2">
          <input
            type="text"
            placeholder="Type reference manually (e.g. SOAR-2026-...)"
            value={manualCode}
            onChange={e => setManualCode(e.target.value)}
            className="flex-1 rounded-xl border border-white/15 bg-[#041d24] px-4 py-3 text-xs text-white placeholder:text-white/30 focus:border-[#efbd3b] focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#efbd3b] px-5 py-3 text-xs font-black text-[#062d31] hover:bg-[#ffd66a] transition"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  )
}
