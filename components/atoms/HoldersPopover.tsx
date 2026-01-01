"use client"

import { Anchor, Fish } from "lucide-react"
import type { Distribution } from "@/types/token"

interface HoldersPopoverProps {
  distribution: Distribution
}

export function HoldersPopover({ distribution }: HoldersPopoverProps) {
  return (
    <div className="absolute bottom-8 left-0 z-50 w-48 bg-[#09090b] border border-white/10 rounded shadow-2xl animate-in slide-in-from-bottom-2 fade-in pointer-events-none">
      <div className="flex justify-between items-center px-3 py-2 border-b border-white/5 bg-white/[0.02]">
        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">BUBBLE MAP</span>
      </div>
      <div className="p-2 space-y-1.5 text-[10px]">
        <div className="flex justify-between items-center p-1 hover:bg-white/5 rounded transition-colors">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Anchor size={11} className="text-purple-400" />
            <span className="font-medium">Whales {">"}1%</span>
          </div>
          <span className="font-mono text-white bg-zinc-800 px-1.5 py-0.5 rounded border border-white/5">
            {distribution.buckets.whalesOver1pct}
          </span>
        </div>
        <div className="flex justify-between items-center p-1 hover:bg-white/5 rounded transition-colors">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Fish size={11} className="text-blue-400" />
            <span className="font-medium">Fish {"<"}0.1%</span>
          </div>
          <span className="font-mono text-white bg-zinc-800 px-1.5 py-0.5 rounded border border-white/5">
            {distribution.buckets.fishUnder01pct}
          </span>
        </div>

        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] text-zinc-500 font-bold">TOP HOLDER</span>
          <span className="text-orange-300 font-mono text-[9px] bg-orange-500/10 px-1 rounded border border-orange-500/20">
            KOL (3.2%)
          </span>
        </div>
      </div>
    </div>
  )
}
