'use client'

import React from 'react'
import { generateQRMatrix } from '@/lib/qr'

interface QRCodeProps {
  value: string
  size?: number
  fgColor?: string
  bgColor?: string
  className?: string
  label?: string
}

export function QRCodeDisplay({
  value,
  size = 180,
  fgColor = '#062d31',
  bgColor = '#ffffff',
  className = '',
  label = 'Scan code'
}: QRCodeProps) {
  const matrix = React.useMemo(() => generateQRMatrix(value), [value])
  const matrixSize = matrix.length
  const margin = 2
  const total = matrixSize + margin * 2

  let pathD = ''
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r][c]) {
        pathD += `M${c + margin},${r + margin}h1v1h-1z `
      }
    }
  }

  return (
    <div 
      className={`inline-flex flex-col items-center justify-center p-3 rounded-2xl ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <svg
        viewBox={`0 0 ${total} ${total}`}
        width={size}
        height={size}
        shapeRendering="crispEdges"
        className="w-full h-auto max-w-full drop-shadow-sm select-none"
        role="img"
        aria-label={label}
      >
        <rect width={total} height={total} fill={bgColor} rx="2" />
        <path d={pathD} fill={fgColor} />
      </svg>
      {label && (
        <span className="mt-2 text-[10px] font-mono font-bold tracking-widest uppercase opacity-70" style={{ color: fgColor }}>
          {value}
        </span>
      )}
    </div>
  )
}
