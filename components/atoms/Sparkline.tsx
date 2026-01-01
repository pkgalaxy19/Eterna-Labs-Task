"use client"

import { memo, useMemo } from "react"

interface SparklineProps {
  data: number[]
  color: string
  width?: number
  height?: number
}

export const Sparkline = memo(function Sparkline({ data, color, width = 60, height = 20 }: SparklineProps) {
  const pathData = useMemo(() => {
    if (data.length < 2) return ""

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((d - min) / range) * height
      return `${x},${y}`
    })

    return `M ${points.join(" L ")}`
  }, [data, width, height])

  const gradientId = useMemo(() => `sparkline-gradient-${Math.random().toString(36).slice(2)}`, [])

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={pathData}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
    </svg>
  )
})
