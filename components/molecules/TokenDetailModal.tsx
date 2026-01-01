"use client"

import { memo, useCallback, useEffect } from "react"
import type { Token } from "@/types/token"
import { formatCash, formatAddress } from "@/lib/format"
import { Sparkline } from "@/components/atoms/Sparkline"
import { cn } from "@/lib/utils"
import { X, Copy, ExternalLink, Twitter, Send, Globe, ShieldAlert, Lock, Unlock, Activity, Users } from "lucide-react"
interface TokenDetailModalProps {
  token: Token | null
  onClose: () => void
}

export const TokenDetailModal = memo(function TokenDetailModal({ token, onClose }: TokenDetailModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  useEffect(() => {
    if (token) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [token])

  const handleCopyAddress = useCallback(() => {
    if (token) {
      navigator.clipboard.writeText(token.id)
    }
  }, [token])

  if (!token) return null

  const isUp = token.flashState === "up"
  const isDown = token.flashState === "down"
  const sparklineColor = isDown ? "#f87171" : "#34d399"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="sticky top-0 bg-[#09090b] border-b border-white/5 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 bg-zinc-900 border border-white/10 overflow-hidden",
                token.tokenIdentity.iconShape === "square" ? "rounded-lg" : "rounded-full",
              )}
            >
              <img
                src={token.tokenIdentity.iconUrl || "/placeholder.svg"}
                alt={token.tokenIdentity.symbol}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-black text-zinc-100">{token.tokenIdentity.symbol}</h2>
              <p className="text-xs text-zinc-500">{token.tokenIdentity.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-zinc-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-white/5">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Contract Address</p>
              <p className="text-sm text-zinc-300 font-mono">{formatAddress(token.id)}</p>
            </div>
            <button
              onClick={handleCopyAddress}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-zinc-200"
              aria-label="Copy address"
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Market Cap</p>
                <p
                  className={cn(
                    "text-2xl font-black tracking-tighter transition-colors",
                    isUp ? "text-emerald-400" : isDown ? "text-red-400" : "text-emerald-500",
                  )}
                >
                  ${formatCash(token.marketData.marketCap)}
                </p>
              </div>
              <Sparkline data={token.marketData.sparkline} color={sparklineColor} width={100} height={40} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase">Liquidity</p>
                <p className="text-sm font-bold text-zinc-200">${formatCash(token.marketData.liquidityUsd)}</p>
              </div>
              <div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase">Volume 5m</p>
                <p className="text-sm font-bold text-zinc-200">${formatCash(token.marketData.volume.v5m)}</p>
              </div>
              <div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase">Volume 1h</p>
                <p className="text-sm font-bold text-zinc-200">${formatCash(token.marketData.volume.v1h)}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert
                size={14}
                className={token.securityForensics.score > 80 ? "text-emerald-500" : "text-amber-500"}
              />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Security Analysis</span>
              <span
                className={cn(
                  "ml-auto text-sm font-mono font-bold px-2 py-0.5 rounded",
                  token.securityForensics.score > 80
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-amber-500/10 text-amber-400",
                )}
              >
                {token.securityForensics.score}/100
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div
                className={cn(
                  "p-2 rounded border flex items-center gap-2",
                  token.securityForensics.mintAuthDisabled
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-red-500/5 border-red-500/20",
                )}
              >
                {token.securityForensics.mintAuthDisabled ? (
                  <Lock size={12} className="text-emerald-500" />
                ) : (
                  <Unlock size={12} className="text-red-500" />
                )}
                <div>
                  <p className="text-[9px] text-zinc-500 font-bold">Mint Auth</p>
                  <p
                    className={cn(
                      "text-xs font-bold",
                      token.securityForensics.mintAuthDisabled ? "text-emerald-400" : "text-red-400",
                    )}
                  >
                    {token.securityForensics.mintAuthDisabled ? "Revoked" : "Enabled"}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "p-2 rounded border flex items-center gap-2",
                  token.securityForensics.freezeAuthDisabled
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-red-500/5 border-red-500/20",
                )}
              >
                {token.securityForensics.freezeAuthDisabled ? (
                  <Lock size={12} className="text-emerald-500" />
                ) : (
                  <Unlock size={12} className="text-red-500" />
                )}
                <div>
                  <p className="text-[9px] text-zinc-500 font-bold">Freeze Auth</p>
                  <p
                    className={cn(
                      "text-xs font-bold",
                      token.securityForensics.freezeAuthDisabled ? "text-emerald-400" : "text-red-400",
                    )}
                  >
                    {token.securityForensics.freezeAuthDisabled ? "Revoked" : "Enabled"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={12} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Transactions (5m)</span>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-lg font-black text-emerald-400">{token.marketData.transactions.buys5m}</p>
                  <p className="text-[9px] text-zinc-500">Buys</p>
                </div>
                <div>
                  <p className="text-lg font-black text-red-400">{token.marketData.transactions.sells5m}</p>
                  <p className="text-[9px] text-zinc-500">Sells</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Users size={12} className="text-blue-500" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Holders</span>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-lg font-black text-purple-400">{token.distribution.buckets.whalesOver1pct}</p>
                  <p className="text-[9px] text-zinc-500">Whales</p>
                </div>
                <div>
                  <p className="text-lg font-black text-blue-400">{token.distribution.buckets.fishUnder01pct}</p>
                  <p className="text-[9px] text-zinc-500">Small</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {token.tokenIdentity.socials.website && (
              <a
                href={token.tokenIdentity.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg transition-colors text-zinc-400 hover:text-zinc-200"
              >
                <Globe size={14} />
                <span className="text-xs font-bold">Website</span>
              </a>
            )}
            {token.tokenIdentity.socials.twitter && (
              <a
                href={token.tokenIdentity.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg transition-colors text-zinc-400 hover:text-blue-400"
              >
                <Twitter size={14} />
                <span className="text-xs font-bold">Twitter</span>
              </a>
            )}
            {token.tokenIdentity.socials.telegram && (
              <a
                href={token.tokenIdentity.socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg transition-colors text-zinc-400 hover:text-blue-500"
              >
                <Send size={14} />
                <span className="text-xs font-bold">Telegram</span>
              </a>
            )}
          </div>
        </div>
        <div className="sticky bottom-0 bg-[#09090b] border-t border-white/5 p-4 flex gap-2">
          <button className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
            <ExternalLink size={14} />
            View on Explorer
          </button>
          <button className="flex-[2] py-3 bg-emerald-500 hover:bg-emerald-400 text-[#09090b] text-sm font-black rounded-lg transition-colors shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]">
            Trade Now
          </button>
        </div>
      </div>
    </div>
  )
})
