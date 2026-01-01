"use client"

import { Terminal } from "lucide-react"
import type { BondingCurve } from "@/types/token"

interface BondingPopoverProps {
  data: BondingCurve
}

export function BondingPopover({ data }: BondingPopoverProps) {
  const solNeeded = data.migrationThreshold - data.solReserves
  const progress = data.progressPercent * 100

  return (
    <div className="absolute bottom-10 right-0 z-50 w-64 bg-[#09090b] border border-emerald-500/20 rounded shadow-[0_4px_20px_-4px_rgba(16,185,129,0.2)] animate-in slide-in-from-bottom-2 fade-in duration-200 pointer-events-none">
      <div className="flex justify-between items-center p-2 border-b border-white/5 bg-white/[0.02]">
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider flex items-center gap-1">
          <Terminal size={10} /> MIGRATION
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-400">LIVE</span>
        </div>
      </div>
      <div className="p-3 space-y-3">
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-zinc-500 font-medium">Progress</span>
            <span className="text-emerald-400 font-mono">{progress.toFixed(2)}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div style={{ width: `${progress}%` }} className="h-full bg-emerald-500 transition-all duration-300" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/5 rounded overflow-hidden border border-white/5">
          <div className="bg-[#0c0c0e] p-2 flex flex-col gap-0.5">
            <span className="text-[9px] text-zinc-500 font-bold">RESERVES</span>
            <span className="text-zinc-200 font-mono text-[11px]">{data.solReserves.toFixed(2)} SOL</span>
          </div>
          <div className="bg-[#0c0c0e] p-2 flex flex-col gap-0.5">
            <span className="text-[9px] text-zinc-500 font-bold">NEEDED</span>
            <span className="text-emerald-400 font-mono text-[11px]">{Math.max(0, solNeeded).toFixed(2)} SOL</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] pt-1">
          <span className="text-zinc-500">Est. Time to Raydium</span>
          <span className="text-zinc-300 font-mono">~{data.timeToFillEst}s</span>
        </div>
      </div>
    </div>
  )
}
