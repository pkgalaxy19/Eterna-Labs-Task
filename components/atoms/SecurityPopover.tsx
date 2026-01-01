"use client"

import { ShieldAlert, Lock, Unlock, Crosshair } from "lucide-react"
import type { SecurityForensics } from "@/types/token"
import { formatAddress } from "@/lib/format"

interface SecurityPopoverProps {
  forensics: SecurityForensics
}

export function SecurityPopover({ forensics }: SecurityPopoverProps) {
  return (
    <div className="absolute top-8 left-0 z-50 w-60 bg-[#09090b] border border-white/10 rounded shadow-xl animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
      <div className="flex items-center justify-between p-2 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <ShieldAlert size={12} className={forensics.score > 80 ? "text-emerald-500" : "text-red-500"} />
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">SECURITY REPORT</span>
        </div>
        <span
          className={`text-[10px] font-mono font-bold ${forensics.score > 80 ? "text-emerald-500" : "text-red-500"}`}
        >
          {forensics.score}/100
        </span>
      </div>

      <div className="p-2 space-y-2">
        <div className="flex items-center justify-between text-[10px] p-1.5 bg-zinc-900/50 rounded border border-white/5">
          <div className="flex flex-col gap-0.5">
            <span className="text-zinc-500 font-bold">DEPLOYER</span>
            <span className="text-zinc-300 font-mono">{formatAddress(forensics.deployer.address)}</span>
          </div>
          <div className="text-right flex flex-col gap-0.5 items-end">
            <span className="text-zinc-500 font-bold">HELD</span>
            <span
              className={`${forensics.deployer.holdingPct > 0.05 ? "text-red-400" : "text-emerald-400"} font-mono font-bold bg-zinc-950 px-1 rounded`}
            >
              {(forensics.deployer.holdingPct * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div
            className={`p-1.5 rounded border ${forensics.mintAuthDisabled ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {forensics.mintAuthDisabled ? (
                <Lock size={10} className="text-emerald-500" />
              ) : (
                <Unlock size={10} className="text-red-500" />
              )}
              <span className="text-[9px] font-bold text-zinc-400">MINT AUTH</span>
            </div>
            <span
              className={`text-[10px] font-bold ${forensics.mintAuthDisabled ? "text-emerald-400" : "text-red-400"}`}
            >
              {forensics.mintAuthDisabled ? "REVOKED" : "ENABLED"}
            </span>
          </div>
          <div
            className={`p-1.5 rounded border ${forensics.freezeAuthDisabled ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {forensics.freezeAuthDisabled ? (
                <Lock size={10} className="text-emerald-500" />
              ) : (
                <Unlock size={10} className="text-red-500" />
              )}
              <span className="text-[9px] font-bold text-zinc-400">FREEZE AUTH</span>
            </div>
            <span
              className={`text-[10px] font-bold ${forensics.freezeAuthDisabled ? "text-emerald-400" : "text-red-400"}`}
            >
              {forensics.freezeAuthDisabled ? "REVOKED" : "ENABLED"}
            </span>
          </div>
        </div>

        <div className="p-2 bg-zinc-900 rounded border border-white/5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] text-zinc-400 font-bold flex items-center gap-1">
              <Crosshair size={9} /> SNIPERS (BLOCK 0)
            </span>
            <span className="text-[9px] text-zinc-500">{forensics.snipers.status.replace("_", " ")}</span>
          </div>
          <div className="flex justify-between items-baseline font-mono text-[10px]">
            <span className="text-white">{forensics.snipers.count} Wallets</span>
            <span className={forensics.snipers.totalSupplySniped > 0.05 ? "text-red-500" : "text-emerald-500"}>
              {(forensics.snipers.totalSupplySniped * 100).toFixed(1)}% Supply
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
