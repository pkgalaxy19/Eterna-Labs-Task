"use client"

import type React from "react"
import { useState, memo, useCallback } from "react"
import type { Token } from "@/types/token"
import { Sparkline } from "@/components/atoms/Sparkline"
import { BondingPopover } from "@/components/atoms/BondingPopover"
import { SecurityPopover } from "@/components/atoms/SecurityPopover"
import { HoldersPopover } from "@/components/atoms/HoldersPopover"
import { Tooltip } from "@/components/atoms/Tooltip"
import { formatCash } from "@/lib/format"
import { cn } from "@/lib/utils"
import {
  Copy,
  Check,
  Send,
  Zap,
  Lock,
  Unlock,
  Twitter,
  BrainCircuit,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Crosshair,
  Activity,
} from "lucide-react"

interface TokenCardProps {
  token: Token
  onSelect?: (token: Token) => void
}

type PopoverType = "security" | "holders" | "bonding" | null

export const TokenCard = memo(function TokenCard({ token, onSelect }: TokenCardProps) {
  const [copied, setCopied] = useState(false)
  const [activePopover, setActivePopover] = useState<PopoverType>(null)

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      navigator.clipboard.writeText(token.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    },
    [token.id],
  )

  const handleCardClick = useCallback(() => {
    onSelect?.(token)
  }, [token, onSelect])

  const isUp = token.flashState === "up"
  const isDown = token.flashState === "down"
  const isMigrated = token.lifecycle.stage === "MIGRATED"
  const isFinalStretch = token.lifecycle.stage === "FINAL_STRETCH"

  const getBorderClass = () => {
    if (isUp) return "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
    if (isDown) return "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
    if (token.marketData.volume.v5m > 50000) return "border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
    return "border-white/10 hover:border-white/20"
  }

  const mcColor = isUp ? "text-emerald-400" : isDown ? "text-red-400" : "text-emerald-500"
  const sparklineColor = isDown ? "#f87171" : "#34d399"

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "relative bg-[#09090b] rounded-xl border transition-all duration-300 ease-out select-none group touch-manipulation cursor-pointer",
        getBorderClass(),
      )}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 pointer-events-none rounded-xl" />
      <div className="p-2.5 md:p-3 relative z-10 flex flex-col gap-2 md:gap-2.5">
        <div className="flex justify-between items-start">
          <div className="flex gap-2 md:gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div
                className={cn(
                  "w-9 h-9 md:w-10 md:h-10 bg-zinc-900 border border-white/10 overflow-hidden ring-1 ring-white/5 group-hover:ring-white/10 transition-all",
                  token.tokenIdentity.iconShape === "square" ? "rounded-lg" : "rounded-full",
                )}
              >
                <img
                  src={token.tokenIdentity.iconUrl || "/placeholder.svg"}
                  alt={token.tokenIdentity.symbol}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <Tooltip content={token.tokenIdentity.platformBadge === "pump_fun" ? "Pump.fun" : "Raydium"}>
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 rounded-[4px] border-2 border-[#09090b] flex items-center justify-center text-[6px] md:text-[7px] font-black text-white shadow-sm cursor-help",
                    token.tokenIdentity.platformBadge === "pump_fun" ? "bg-[#1839db]" : "bg-purple-500",
                  )}
                >
                  {token.tokenIdentity.platformBadge === "pump_fun" ? "P" : "R"}
                </div>
              </Tooltip>
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <div className="flex items-center gap-1 md:gap-1.5">
                <span className="text-[13px] md:text-[14px] font-black tracking-tight text-zinc-100 leading-none truncate">
                  {token.tokenIdentity.symbol}
                </span>
                <Tooltip content={`Created ${token.lifecycle.ageHumanReadable} ago`}>
                  <span className="text-[8px] md:text-[9px] text-zinc-500 font-bold bg-white/5 border border-white/5 px-1 rounded-[3px] uppercase tracking-wide cursor-help">
                    {token.lifecycle.ageHumanReadable}
                  </span>
                </Tooltip>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 group/ca text-[10px] md:text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors mt-0.5"
              >
                <span className="truncate max-w-[80px] md:max-w-[100px] font-medium tracking-tight opacity-70 group-hover/ca:opacity-100 transition-opacity">
                  {token.tokenIdentity.name}
                </span>
                {copied ? (
                  <Check size={10} className="text-emerald-500" />
                ) : (
                  <Copy size={10} className="opacity-0 group-hover/ca:opacity-100 transition-opacity" />
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 md:gap-2 h-[18px] md:h-[20px]">
              <div className={cn("transition-opacity duration-300", token.flashState ? "opacity-100" : "opacity-0")}>
                {token.flashState === "up" ? (
                  <ArrowUpRight size={12} className="text-emerald-500" />
                ) : (
                  <ArrowDownRight size={12} className="text-red-500" />
                )}
              </div>
              <Sparkline data={token.marketData.sparkline} color={sparklineColor} width={50} height={16} />
            </div>
            <div className="flex gap-2 md:gap-2.5 text-zinc-600 mt-0.5 md:mt-1">
              <Tooltip content="Website">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-zinc-300 cursor-pointer transition-colors"
                >
                  <Globe size={12} />
                </button>
              </Tooltip>
              <Tooltip content="Twitter">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-blue-400 cursor-pointer transition-colors"
                >
                  <Twitter size={12} />
                </button>
              </Tooltip>
              <Tooltip content="Telegram">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-blue-500 cursor-pointer transition-colors"
                >
                  <Send size={12} />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 md:gap-2">
          <div className="bg-zinc-900/30 p-1.5 md:p-2 border border-white/5 rounded-md flex flex-col justify-between group/metric hover:bg-zinc-900/50 transition-colors">
            <p className="text-[8px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Market Cap</p>
            <p
              className={cn(
                "text-[14px] md:text-[15px] font-black tracking-tighter transition-colors duration-300",
                mcColor,
              )}
            >
              ${formatCash(token.marketData.marketCap)}
            </p>
          </div>

          <div className="bg-zinc-900/30 p-1.5 md:p-2 border border-white/5 rounded-md flex flex-col justify-between group/metric hover:bg-zinc-900/50 transition-colors">
            <p className="text-[8px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Liquidity</p>
            <div className="flex items-baseline gap-1 md:gap-1.5">
              <p className="text-[14px] md:text-[15px] font-black text-zinc-200 tracking-tighter">
                ${formatCash(token.marketData.liquidityUsd)}
              </p>
              <Tooltip content="Liquidity to Market Cap ratio">
                <span className="text-[8px] md:text-[9px] text-zinc-500 font-bold bg-white/5 px-1 rounded cursor-help">
                  {((token.marketData.liquidityUsd / token.marketData.marketCap) * 100).toFixed(0)}%
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 md:gap-1.5 items-center relative min-h-[20px] md:min-h-[22px]">
          <div
            className="group/sec relative px-1 md:px-1.5 py-0.5 rounded-[3px] border border-white/5 bg-zinc-800/30 text-[9px] md:text-[10px] font-bold text-zinc-400 flex items-center gap-1 md:gap-1.5 hover:border-white/20 hover:text-zinc-200 cursor-help transition-colors"
            onMouseEnter={() => setActivePopover("security")}
            onMouseLeave={() => setActivePopover(null)}
            onClick={(e) => e.stopPropagation()}
          >
            <ShieldAlert
              size={10}
              className={token.securityForensics.score > 80 ? "text-emerald-500" : "text-amber-500"}
            />
            <span>{token.securityForensics.score}</span>
            {activePopover === "security" && <SecurityPopover forensics={token.securityForensics} />}
          </div>
          <Tooltip
            content={token.securityForensics.mintAuthDisabled ? "Mint Authority Revoked" : "Mint Authority Enabled"}
          >
            <div
              className={cn(
                "px-1 md:px-1.5 py-0.5 rounded-[3px] border text-[8px] md:text-[9px] font-black uppercase flex items-center gap-1 cursor-help",
                token.securityForensics.mintAuthDisabled
                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500/90"
                  : "bg-red-500/5 border-red-500/20 text-red-500",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {token.securityForensics.mintAuthDisabled ? <Lock size={8} /> : <Unlock size={8} />}
            </div>
          </Tooltip>
          <div
            className="relative px-1 md:px-1.5 py-0.5 rounded-[3px] border border-white/5 bg-zinc-800/30 text-[9px] md:text-[10px] font-bold text-zinc-400 flex items-center gap-1 md:gap-1.5 hover:border-white/20 hover:text-zinc-200 cursor-help transition-colors"
            onMouseEnter={() => setActivePopover("holders")}
            onMouseLeave={() => setActivePopover(null)}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[8px] md:text-[9px] text-zinc-500 font-black">T10</span>
            <span
              className={token.securityForensics.insiders.holdingPct * 10 > 30 ? "text-red-400" : "text-emerald-400"}
            >
              {(token.securityForensics.insiders.holdingPct * 100 + 10).toFixed(1)}%
            </span>
            {activePopover === "holders" && <HoldersPopover distribution={token.distribution} />}
          </div>
          {token.securityForensics.snipers.count > 0 && (
            <Tooltip content={`${token.securityForensics.snipers.count} snipers detected`}>
              <div
                className="px-1 md:px-1.5 py-0.5 rounded-[3px] border border-white/5 bg-zinc-800/30 text-[9px] md:text-[10px] font-bold text-zinc-400 flex items-center gap-1 cursor-help"
                onClick={(e) => e.stopPropagation()}
              >
                <Crosshair size={9} className="text-zinc-500" /> {token.securityForensics.snipers.count}
              </div>
            </Tooltip>
          )}
          {token.socialSignals.smartMoneyCount > 0 && (
            <Tooltip content="Smart money wallets detected">
              <div
                className="ml-auto px-1 md:px-1.5 py-0.5 rounded-[3px] bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] md:text-[9px] font-black uppercase flex items-center gap-1 animate-pulse cursor-help"
                onClick={(e) => e.stopPropagation()}
              >
                <BrainCircuit size={9} /> {token.socialSignals.smartMoneyCount}
              </div>
            </Tooltip>
          )}
        </div>

        {(isFinalStretch || (!isMigrated && token.lifecycle.bondingCurve.isActive)) && (
          <div
            className="relative group/bonding cursor-crosshair py-0.5 md:py-1"
            onMouseEnter={() => setActivePopover("bonding")}
            onMouseLeave={() => setActivePopover(null)}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between text-[8px] md:text-[9px] font-bold uppercase tracking-widest mb-1 md:mb-1.5">
              <span className="text-zinc-500">Bonding Curve</span>
              <span className="text-emerald-400 font-mono">
                {(token.lifecycle.bondingCurve.progressPercent * 100).toFixed(2)}%
              </span>
            </div>

            <div className="h-1 md:h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.4)] relative transition-all duration-500"
                style={{ width: `${token.lifecycle.bondingCurve.progressPercent * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/30 skew-x-[-20deg] animate-shimmer w-10 blur-sm" />
              </div>
            </div>
            {activePopover === "bonding" && <BondingPopover data={token.lifecycle.bondingCurve} />}
          </div>
        )}

        <div className="flex gap-1 md:gap-1.5 mt-0.5">
          {token.userExecution.quickBuyDefaults.slice(0, 2).map((amt) => (
            <button
              key={amt}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-zinc-900 border border-white/5 hover:bg-zinc-800 hover:border-white/10 text-zinc-300 text-[10px] md:text-[11px] font-bold py-1.5 rounded-[4px] transition-all active:scale-[0.98] active:bg-zinc-700"
            >
              {amt} SOL
            </button>
          ))}
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex-[1.5] bg-emerald-500 hover:bg-emerald-400 text-[#09090b] px-2 md:px-3 py-1.5 rounded-[4px] font-black text-[11px] md:text-[12px] shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)] hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.6)] transition-all active:scale-[0.98] flex items-center justify-center gap-1 md:gap-1.5"
          >
            <Zap size={11} fill="currentColor" strokeWidth={3} /> BUY
          </button>
        </div>
      </div>
      <div className="bg-zinc-950/50 py-1 md:py-1.5 px-2.5 md:px-3 border-t border-white/5 rounded-b-xl flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-1 md:gap-1.5">
            <Activity size={9} className="text-emerald-500" />
            <span className="text-[8px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-wide">
              <span className="text-zinc-300">{token.marketData.transactions.buys5m}</span> Buys
            </span>
          </div>
          <div className="w-px h-2 bg-zinc-800" />
          <span className="text-[8px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-wide">
            <span className="text-red-400">{token.marketData.transactions.sells5m}</span> Sells
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "w-1 md:w-1.5 h-1 md:h-1.5 rounded-full",
              token.socialSignals.tweetSentiment.mentionCount > 10 ? "bg-blue-500 animate-pulse" : "bg-zinc-700",
            )}
          />
          <span className="text-[8px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-wide">
            {token.socialSignals.tweetSentiment.mentionCount} Tweets
          </span>
        </div>
      </div>
    </div>
  )
})
