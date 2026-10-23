'use client'

import { OfflineManifest, OfflineManifestEntry } from '../security/tokens'

const DB_NAME = 'soar_2026_scanner_offline_db'
const DB_VERSION = 1
const MANIFEST_STORE = 'manifest_cache'
const QUEUE_STORE = 'pending_scans'

export interface QueuedScan {
  operationId: string
  ticketCode: string
  timestamp: string
  gate: string
  attendeeName?: string
  status: 'pending' | 'synced' | 'failed'
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'))
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(MANIFEST_STORE)) {
        db.createObjectStore(MANIFEST_STORE, { keyPath: 'ticketCode' })
      }
      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        db.createObjectStore(QUEUE_STORE, { keyPath: 'operationId' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Download and cache signed offline manifest into IndexedDB
 */
export async function downloadAndCacheManifest(eventId = 'soar-2026'): Promise<{
  success: boolean
  cachedCount: number
  version: number
  expiresAt: string
}> {
  const res = await fetch(`/api/v1/sync/manifest?eventId=${eventId}`)
  if (!res.ok) {
    throw new Error('Failed to download validation manifest from server')
  }

  const manifest: OfflineManifest = await res.json()
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction([MANIFEST_STORE], 'readwrite')
    const store = tx.objectStore(MANIFEST_STORE)

    // Clear old manifest entries
    store.clear()

    manifest.entries.forEach(entry => {
      store.put(entry)
    })

    tx.oncomplete = () => {
      resolve({
        success: true,
        cachedCount: manifest.entries.length,
        version: manifest.manifestVersion,
        expiresAt: manifest.expiresAt
      })
    }

    tx.onerror = () => reject(tx.error)
  })
}

/**
 * Validate a ticket locally against IndexedDB in sub-50ms with performance telemetry
 */
export async function localOfflineValidate(ticketCodeOrRef: string, gate = 'Gate 1'): Promise<{
  valid: boolean
  status: 'granted' | 'already_scanned_locally' | 'revoked' | 'not_found'
  attendeeName?: string
  category?: string
  durationMs: number
  operationId: string
}> {
  const startTime = performance.now()
  const db = await openDB()
  const cleanCode = ticketCodeOrRef.trim()
  const operationId = `op_offline_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

  return new Promise((resolve, reject) => {
    const tx = db.transaction([MANIFEST_STORE, QUEUE_STORE], 'readwrite')
    const manifestStore = tx.objectStore(MANIFEST_STORE)
    const queueStore = tx.objectStore(QUEUE_STORE)

    const req = manifestStore.get(cleanCode)

    req.onsuccess = () => {
      const entry: OfflineManifestEntry | undefined = req.result
      const durationMs = Number((performance.now() - startTime).toFixed(2))

      if (!entry) {
        // Fallback: search by reference if not matching raw ticketCode
        const allReq = manifestStore.getAll()
        allReq.onsuccess = () => {
          const allEntries: OfflineManifestEntry[] = allReq.result || []
          const found = allEntries.find(e => e.reference.toUpperCase() === cleanCode.toUpperCase())

          if (!found) {
            resolve({
              valid: false,
              status: 'not_found',
              durationMs: Number((performance.now() - startTime).toFixed(2)),
              operationId
            })
            return
          }

          proceedWithFoundEntry(found)
        }
        return
      }

      proceedWithFoundEntry(entry)

      function proceedWithFoundEntry(manifestEntry: OfflineManifestEntry) {
        if (manifestEntry.status === 'revoked') {
          resolve({
            valid: false,
            status: 'revoked',
            attendeeName: manifestEntry.name,
            durationMs,
            operationId
          })
          return
        }

        // Check if locally scanned already in pending queue!
        const queueReq = queueStore.getAll()
        queueReq.onsuccess = () => {
          const pendingScans: QueuedScan[] = queueReq.result || []
          const alreadyQueued = pendingScans.find(s => s.ticketCode === manifestEntry.ticketCode)

          if (alreadyQueued || manifestEntry.status === 'used') {
            resolve({
              valid: false,
              status: 'already_scanned_locally',
              attendeeName: manifestEntry.name,
              category: manifestEntry.category,
              durationMs,
              operationId
            })
            return
          }

          // Record in local durable scan queue
          const scanItem: QueuedScan = {
            operationId,
            ticketCode: manifestEntry.ticketCode,
            timestamp: new Date().toISOString(),
            gate,
            attendeeName: manifestEntry.name,
            status: 'pending'
          }
          queueStore.put(scanItem)

          // Mark entry locally as used
          manifestEntry.status = 'used'
          manifestStore.put(manifestEntry)

          resolve({
            valid: true,
            status: 'granted',
            attendeeName: manifestEntry.name,
            category: manifestEntry.category,
            durationMs: Number((performance.now() - startTime).toFixed(2)),
            operationId
          })
        }
      }
    }

    req.onerror = () => reject(req.error)
  })
}

/**
 * Get count of pending offline scans awaiting server reconciliation
 */
export async function getPendingScanCount(): Promise<number> {
  try {
    const db = await openDB()
    return new Promise(resolve => {
      const tx = db.transaction([QUEUE_STORE], 'readonly')
      const countReq = tx.objectStore(QUEUE_STORE).count()
      countReq.onsuccess = () => resolve(countReq.result)
      countReq.onerror = () => resolve(0)
    })
  } catch {
    return 0
  }
}

/**
 * Flush and synchronize pending scan queue to server API
 */
export async function syncPendingScans(deviceId = 'device_station_01'): Promise<{
  success: boolean
  syncedCount: number
  duplicatesCount: number
  rejectedCount: number
  message: string
}> {
  const db = await openDB()

  const pendingScans: QueuedScan[] = await new Promise((resolve, reject) => {
    const tx = db.transaction([QUEUE_STORE], 'readonly')
    const req = tx.objectStore(QUEUE_STORE).getAll()
    req.onsuccess = () => resolve(req.result || [])
    req.onerror = () => reject(req.error)
  })

  if (pendingScans.length === 0) {
    return {
      success: true,
      syncedCount: 0,
      duplicatesCount: 0,
      rejectedCount: 0,
      message: 'Queue is clear. No offline scans to reconcile.'
    }
  }

  const res = await fetch('/api/v1/sync/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deviceId,
      scans: pendingScans
    })
  })

  if (!res.ok) {
    throw new Error('Server reconciliation failed. Scans preserved in local queue.')
  }

  const report = await res.json()

  // Clear synced scans from queue
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([QUEUE_STORE], 'readwrite')
    tx.objectStore(QUEUE_STORE).clear()
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })

  return {
    success: true,
    syncedCount: report.successful,
    duplicatesCount: report.duplicates,
    rejectedCount: report.rejected,
    message: `Reconciled ${report.successful} check-ins (${report.duplicates} duplicates flagged).`
  }
}
