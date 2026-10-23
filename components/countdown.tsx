'use client'

import React, { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isReady: boolean
}

export function CountdownTimer({ targetDate = '2026-12-10T09:00:00+01:00' }: { targetDate?: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isReady: false
  })

  useEffect(() => {
    function calculate() {
      const difference = +new Date(targetDate) - +new Date()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isReady: true
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isReady: true })
      }
    }

    calculate()
    const timer = setInterval(calculate, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ]

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {units.map((unit, i) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center">
            <div className="flex min-w-[52px] sm:min-w-[64px] h-14 sm:h-16 items-center justify-center rounded-xl border border-[#efbd3b]/30 bg-[#062d31]/90 backdrop-blur-md px-2 shadow-inner">
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#ffd66a]">
                {timeLeft.isReady ? String(unit.value).padStart(2, '0') : '--'}
              </span>
            </div>
            <span className="mt-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/50">
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-xl sm:text-2xl font-black text-[#efbd3b]/50 mb-5">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
