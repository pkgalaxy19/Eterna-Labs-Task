"use client"

import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { PulseColumn } from "@/components/organisms/PulseColumn"
import { ErrorBoundary } from "@/components/atoms/ErrorBoundary"
import { useTokensQuery } from "@/hooks/useTokensQuery"
import { useWebSocketMock } from "@/hooks/useWebSocketMock"
import { Activity, RefreshCw, Menu, X, AlertCircle } from "lucide-react"
import type { TokenStatus } from "@/types/token"
import { cn } from "@/lib/utils"

const TABS: { status: TokenStatus; label: string }[] = [
  { status: "NEW_PAIRS", label: "New Pairs" },
  { status: "FINAL_STRETCH", label: "Final Stretch" },
  { status: "MIGRATED", label: "Migrated" },
]

export default function PulsePage() {
  const { isLoading, isError, error, refetch } = useTokensQuery()
  useWebSocketMock()

  const [mobileTab, setMobileTab] = useState<TokenStatus>("NEW_PAIRS")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tokensMap = useSelector((state: RootState) => state.tokens.entities)
  const tokens = Object.values(tokensMap)

  const newPairs = useMemo(() => tokens.filter((t) => t.lifecycle.stage === "NEW_PAIRS"), [tokens])
  const finalStretch = useMemo(() => tokens.filter((t) => t.lifecycle.stage === "FINAL_STRETCH"), [tokens])
  const migrated = useMemo(() => tokens.filter((t) => t.lifecycle.stage === "MIGRATED"), [tokens])

  const getTokensByStatus = (status: TokenStatus) => {
    switch (status) {
      case "NEW_PAIRS":
        return newPairs
      case "FINAL_STRETCH":
        return finalStretch
      case "MIGRATED":
        return migrated
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-[100dvh] bg-[#050505] text-zinc-100 font-sans overflow-hidden">
        <div className="h-10 border-b border-white/5 flex items-center justify-between px-3 md:px-4 bg-[#09090b] shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center font-black text-black text-[10px]">
                A
              </div>
              <span className="font-black text-xs tracking-tighter">
                AXIOM <span className="text-zinc-500 hidden sm:inline">PULSE</span>
              </span>
            </div>
            <div className="hidden sm:block h-4 w-[1px] bg-white/10 mx-2" />
            <div className="hidden sm:flex items-center gap-3 text-[10px] font-bold text-zinc-500">
              <span className="text-emerald-500 flex items-center gap-1">
                <Activity size={10} /> SOL: $242.45
              </span>
              <span className="text-blue-500">GAS: 14 GWEI</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isError && (
              <button
                onClick={() => refetch()}
                className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded text-[10px] font-bold text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <AlertCircle size={10} />
                <span className="hidden xs:inline">Error - Retry</span>
              </button>
            )}

            <div className="flex items-center gap-2 bg-zinc-800 px-2 py-1 rounded text-[10px] font-bold text-zinc-400">
              <RefreshCw size={10} className={isLoading ? "animate-spin" : ""} />
              <span className="hidden xs:inline">{isLoading ? "SYNCING..." : isError ? "ERROR" : "LIVE"}</span>
            </div>

      
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1 text-zinc-400">
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

  
        <div className="md:hidden border-b border-white/5 bg-[#09090b]">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.status}
                onClick={() => setMobileTab(tab.status)}
                className={cn(
                  "flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors relative",
                  mobileTab === tab.status ? "text-emerald-400" : "text-zinc-500",
                )}
              >
                {tab.label}
                <span className="ml-1 text-[9px] opacity-70">({getTokensByStatus(tab.status).length})</span>
                {mobileTab === tab.status && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:grid flex-1 min-h-0 grid-cols-3 overflow-hidden">
          <PulseColumn title="NEW PAIRS" status="NEW_PAIRS" tokens={newPairs} isLoading={isLoading} />
          <PulseColumn title="FINAL STRETCH" status="FINAL_STRETCH" tokens={finalStretch} isLoading={isLoading} />
          <PulseColumn title="MIGRATED" status="MIGRATED" tokens={migrated} isLoading={isLoading} />
        </div>

        <div className="md:hidden flex-1 min-h-0 overflow-hidden">
          <PulseColumn
            title={TABS.find((t) => t.status === mobileTab)?.label || ""}
            status={mobileTab}
            tokens={getTokensByStatus(mobileTab)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
