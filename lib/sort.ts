import type { Token } from "@/types/token"

export type SortKey = "age" | "marketCap" | "liquidity" | "volume" | "score"

export function sortTokens(tokens: Token[], key: SortKey, direction: "asc" | "desc"): Token[] {
  return [...tokens].sort((a, b) => {
    let aVal: number
    let bVal: number

    switch (key) {
      case "age":
        aVal = Date.now() - a.lifecycle.createdAtTs
        bVal = Date.now() - b.lifecycle.createdAtTs
        break
      case "marketCap":
        aVal = a.marketData.marketCap
        bVal = b.marketData.marketCap
        break
      case "liquidity":
        aVal = a.marketData.liquidityUsd
        bVal = b.marketData.liquidityUsd
        break
      case "volume":
        aVal = a.marketData.volume.v5m
        bVal = b.marketData.volume.v5m
        break
      case "score":
        aVal = a.securityForensics.score
        bVal = b.securityForensics.score
        break
      default:
        aVal = 0
        bVal = 0
    }

    return direction === "asc" ? aVal - bVal : bVal - aVal
  })
}
