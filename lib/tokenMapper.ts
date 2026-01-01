// src/lib/tokenMapper.ts
import type { Token, TokenStatus, PlatformBadge } from "@/types/token"

function inferStage(pair: any): TokenStatus {
  if (pair.dexId === "raydium") return "MIGRATED"
  return "NEW_PAIRS"
}

function inferPlatformBadge(stage: TokenStatus): PlatformBadge {
  return stage === "MIGRATED" ? "raydium" : "pump_fun"
}

function formatAge(createdAt?: number): string {
  if (!createdAt) return "—"
  const mins = Math.floor((Date.now() - createdAt) / 60000)
  return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h`
}

function inferVolumeDirection(buys: number, sells: number) {
  if (buys > sells * 1.2) return "BUY_HEAVY"
  if (sells > buys * 1.2) return "SELL_HEAVY"
  return "NEUTRAL"
}

export function mapDexPairToToken(
  pair: any,
  index: number
): Token {
  const stage = inferStage(pair)
  const platformBadge = inferPlatformBadge(stage)

  const buys5m = pair.txns?.m5?.buys ?? 0
  const sells5m = pair.txns?.m5?.sells ?? 0

  return {
    id: pair.pairAddress,
    timestamp: Date.now(),
    sequenceId: index,
    flashState: null,

    tokenIdentity: {
      symbol: pair.baseToken?.symbol ?? "—",
      name: pair.baseToken?.name ?? "Unknown",
      iconUrl: pair.info?.imageUrl ?? "",
      iconShape: stage === "MIGRATED" ? "circle" : "square",
      platformBadge,
      socials: {
        twitter: pair.info?.twitter,
        website: pair.info?.website,
        telegram: pair.info?.telegram,
      },
    },

    lifecycle: {
      stage,
      createdAtTs: pair.pairCreatedAt ?? Date.now(),
      ageHumanReadable: formatAge(pair.pairCreatedAt),
      bondingCurve: {
        isActive: stage !== "MIGRATED",
        progressPercent: stage === "MIGRATED" ? 1 : 0.25,
        solReserves: 0,
        migrationThreshold: 85,
        timeToFillEst: 0,
      },
    },

    marketData: {
      priceUsd: Number(pair.priceUsd ?? 0),
      priceSol: 0,
      marketCap: pair.fdv ?? 0,
      liquidityUsd: pair.liquidity?.usd ?? 0,
      volume: {
        v5m: pair.volume?.m5 ?? 0,
        v1h: pair.volume?.h1 ?? 0,
        direction: inferVolumeDirection(buys5m, sells5m),
      },
      transactions: {
        buys5m,
        sells5m,
        ratio: sells5m === 0 ? buys5m : Number((buys5m / sells5m).toFixed(2)),
      },
      sparkline: [],
    },

    securityForensics: {
      score: 0,
      isHoneypot: false,
      mintAuthDisabled: true,
      freezeAuthDisabled: true,
      deployer: {
        address: "",
        holdingPct: 0,
        isSelling: false,
        tags: [],
      },
      snipers: {
        count: 0,
        totalSupplySniped: 0,
        status: "LOW_RISK",
      },
      insiders: {
        count: 0,
        holdingPct: 0,
      },
      bundles: {
        isBundled: false,
        bundleSupplyPct: 0,
      },
    },

    distribution: {
      buckets: {
        whalesOver1pct: 0,
        fishUnder01pct: 0,
      },
    },

    socialSignals: {
      smartMoneyCount: 0,
      whaleCount: 0,
      freshWalletCount: 0,
      tweetSentiment: {
        mentionCount: 0,
        influencerMentions: [],
      },
    },

    userExecution: {
      quickBuyDefaults: [0.5, 1, 5],
      userHolding: {
        isHeld: false,
        balance: 0,
        pnlUsd: 0,
      },
    },
  }
}
