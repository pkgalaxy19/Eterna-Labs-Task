"use client"

import { memo, useMemo, useState, useCallback } from "react"
import type { Token, TokenStatus } from "@/types/token"
import type { SortKey } from "@/lib/sort"
import { TokenCard } from "./TokenCard"
import { SkeletonCard } from "@/components/molecules/SkeletonCard"
import { TokenDetailModal } from "@/components/molecules/TokenDetailModal"
import { ErrorBoundary } from "@/components/atoms/ErrorBoundary"
import { sortTokens } from "@/lib/sort"
import { ChevronDown, Flame, Zap, Anchor, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PulseColumnProps {
  title: string
  status: TokenStatus
  tokens: Token[]
  isLoading: boolean
}

const COLUMN_CONFIG: Record<TokenStatus, { icon: LucideIcon; color: string }> = {
  NEW_PAIRS: { icon: Flame, color: "text-orange-500" },
  FINAL_STRETCH: { icon: Zap, color: "text-emerald-500" },
  MIGRATED: { icon: Anchor, color: "text-blue-500" },
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "age", label: "AGE" },
  { key: "marketCap", label: "MCAP" },
  { key: "liquidity", label: "LIQ" },
  { key: "volume", label: "VOL" },
  { key: "score", label: "SCORE" },
]

export const PulseColumn = memo(function PulseColumn({ title, status, tokens, isLoading }: PulseColumnProps) {
  const [sortKey, setSortKey] = useState<SortKey>("age")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)

  const config = COLUMN_CONFIG[status]
  const Icon = config.icon

  const handleSortChange = useCallback(
    (key: SortKey) => {
      if (key === sortKey) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
      } else {
        setSortKey(key)
        setSortDirection("asc")
      }
      setShowSortMenu(false)
    },
    [sortKey],
  )

  const sortedTokens = useMemo(() => {
    return sortTokens(tokens, sortKey, sortDirection)
  }, [tokens, sortKey, sortDirection])

  const handleTokenSelect = useCallback((token: Token) => {
    setSelectedToken(token)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedToken(null)
  }, [])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full min-h-0 border-r border-white/5 last:border-r-0 bg-[#050505]">
        <div className="hidden md:flex h-12 border-b border-white/5 items-center justify-between px-4 shrink-0 bg-[#050505] z-20 backdrop-blur-sm bg-opacity-90">
          <div className="flex items-center gap-2">
            <Icon size={14} className={config.color} />
            <span className="text-[11px] font-black tracking-widest text-zinc-300">{title}</span>
            <span className="text-[9px] font-bold text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded">
              {tokens.length}
            </span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 text-zinc-500 hover:text-white cursor-pointer transition-colors"
            >
              <span className="text-[9px] font-bold">SORT: {SORT_OPTIONS.find((o) => o.key === sortKey)?.label}</span>
              <ChevronDown size={10} className={cn("transition-transform", showSortMenu && "rotate-180")} />
            </button>

            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowSortMenu(false)} />
                <div className="absolute top-full right-0 mt-1 bg-[#09090b] border border-white/10 rounded shadow-xl z-30 min-w-[100px] py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleSortChange(option.key)}
                      className={cn(
                        "w-full px-3 py-1.5 text-left text-[10px] font-bold transition-colors flex items-center justify-between",
                        sortKey === option.key
                          ? "text-emerald-400 bg-white/5"
                          : "text-zinc-400 hover:text-white hover:bg-white/5",
                      )}
                    >
                      {option.label}
                      {sortKey === option.key && (
                        <span className="text-[8px]">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-white/5 bg-[#0a0a0a] shrink-0">
          <span className="text-[10px] text-zinc-500 font-bold">{tokens.length} tokens</span>
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold"
            >
              SORT: {SORT_OPTIONS.find((o) => o.key === sortKey)?.label}
              <ChevronDown size={10} className={cn("transition-transform", showSortMenu && "rotate-180")} />
            </button>

            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowSortMenu(false)} />
                <div className="absolute top-full right-0 mt-1 bg-[#09090b] border border-white/10 rounded shadow-xl z-30 min-w-[100px] py-1">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleSortChange(option.key)}
                      className={cn(
                        "w-full px-3 py-2 text-left text-[11px] font-bold transition-colors flex items-center justify-between",
                        sortKey === option.key
                          ? "text-emerald-400 bg-white/5"
                          : "text-zinc-400 hover:text-white hover:bg-white/5",
                      )}
                    >
                      {option.label}
                      {sortKey === option.key && (
                        <span className="text-[9px]">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-2 md:p-3 custom-scrollbar">
          <div className="flex flex-col gap-2 md:gap-3">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : sortedTokens.map((token) => <TokenCard key={token.id} token={token} onSelect={handleTokenSelect} />)}

            {!isLoading && sortedTokens.length === 0 && (
              <div className="text-center py-12 text-zinc-600 text-sm">No tokens in this category</div>
            )}
          </div>
        </div>
        <TokenDetailModal token={selectedToken} onClose={handleCloseModal} />
      </div>
    </ErrorBoundary>
  )
})
