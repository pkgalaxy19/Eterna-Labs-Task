import type { Token, TokenStatus } from "@/types/token"

const TOKEN_NAMES = [
  { symbol: "PEPE", name: "Pepe on Solana" },
  { symbol: "DOGE", name: "Dogecoin Sol" },
  { symbol: "SHIB", name: "Shiba Sol" },
  { symbol: "BONK", name: "Bonk Inu" },
  { symbol: "WIF", name: "Dogwifhat" },
  { symbol: "MYRO", name: "Myro" },
  { symbol: "POPCAT", name: "Pop Cat" },
  { symbol: "MOG", name: "Mog Coin" },
  { symbol: "BRETT", name: "Brett" },
  { symbol: "TURBO", name: "Turbo" },
  { symbol: "FLOKI", name: "Floki Inu" },
  { symbol: "WOJAK", name: "Wojak" },
  { symbol: "MEME", name: "Memecoin" },
  { symbol: "BOME", name: "Book of Meme" },
  { symbol: "SLERF", name: "Slerf" },
  { symbol: "MEW", name: "Cat in Dogs World" },
  { symbol: "NEIRO", name: "Neiro" },
  { symbol: "GIGA", name: "Gigachad" },
  { symbol: "APU", name: "Apu Apustaja" },
  { symbol: "SPX", name: "SPX6900" },
]

function randomAddress(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function generateSparkline(trend: "up" | "down" | "neutral"): number[] {
  const points: number[] = []
  let value = Math.random() * 0.0001

  for (let i = 0; i < 12; i++) {
    const change =
      trend === "up"
        ? Math.random() * 0.00002
        : trend === "down"
          ? -Math.random() * 0.00002
          : (Math.random() - 0.5) * 0.00002

    value = Math.max(0.00001, value + change)
    points.push(value)
  }
  return points
}

export function generateToken(index: number, stage: TokenStatus): Token {
  const tokenData = TOKEN_NAMES[index % TOKEN_NAMES.length]
  const isMigrated = stage === "MIGRATED"
  const isFinalStretch = stage === "FINAL_STRETCH"

  const marketCap = isMigrated
    ? 100000 + Math.random() * 900000
    : isFinalStretch
      ? 50000 + Math.random() * 100000
      : 5000 + Math.random() * 50000

  const liquidityRatio = 0.1 + Math.random() * 0.3
  const liquidityUsd = marketCap * liquidityRatio

  const progressPercent = isMigrated ? 1.0 : isFinalStretch ? 0.8 + Math.random() * 0.19 : Math.random() * 0.4

  const ageMinutes = isMigrated
    ? 180 + Math.floor(Math.random() * 300)
    : isFinalStretch
      ? 30 + Math.floor(Math.random() * 60)
      : Math.floor(Math.random() * 30)

  const trend = Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "neutral"

  const buys = Math.floor(20 + Math.random() * 200)
  const sells = Math.floor(5 + Math.random() * 50)

  return {
    id: `${stage}-${index}-${Date.now()}`,
    timestamp: Date.now(),
    sequenceId: index,
    flashState: null,
    tokenIdentity: {
      symbol: tokenData.symbol + (index > TOKEN_NAMES.length ? index : ""),
      name: tokenData.name,
      iconUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${tokenData.symbol}${index}`,
      iconShape: isMigrated ? "circle" : "square",
      platformBadge: isMigrated ? "raydium" : "pump_fun",
      socials: {
        twitter: `https://x.com/${tokenData.symbol.toLowerCase()}`,
        website: `https://${tokenData.symbol.toLowerCase()}.sol`,
        telegram: `https://t.me/${tokenData.symbol.toLowerCase()}`,
      },
    },
    lifecycle: {
      stage,
      createdAtTs: Date.now() - ageMinutes * 60 * 1000,
      ageHumanReadable: ageMinutes < 60 ? `${ageMinutes}m` : `${Math.floor(ageMinutes / 60)}h`,
      bondingCurve: {
        isActive: !isMigrated,
        progressPercent,
        solReserves: progressPercent * 85,
        migrationThreshold: 85,
        timeToFillEst: Math.floor((1 - progressPercent) * 300),
      },
    },
    marketData: {
      priceUsd: 0.00001 + Math.random() * 0.001,
      priceSol: 0.0000001 + Math.random() * 0.00001,
      marketCap,
      liquidityUsd,
      volume: {
        v5m: 1000 + Math.random() * 100000,
        v1h: 5000 + Math.random() * 500000,
        direction: trend === "up" ? "BUY_HEAVY" : trend === "down" ? "SELL_HEAVY" : "NEUTRAL",
      },
      transactions: {
        buys5m: buys,
        sells5m: sells,
        ratio: Number.parseFloat((buys / sells).toFixed(2)),
      },
      sparkline: generateSparkline(trend),
    },
    securityForensics: {
      score: 60 + Math.floor(Math.random() * 40),
      isHoneypot: false,
      mintAuthDisabled: Math.random() > 0.2,
      freezeAuthDisabled: Math.random() > 0.2,
      deployer: {
        address: randomAddress(),
        holdingPct: Math.random() * 0.1,
        isSelling: Math.random() > 0.8,
        tags: Math.random() > 0.7 ? ["serial_deployer"] : [],
      },
      snipers: {
        count: Math.floor(Math.random() * 5),
        totalSupplySniped: Math.random() * 0.05,
        status: Math.random() > 0.7 ? "MEDIUM_RISK" : "LOW_RISK",
      },
      insiders: {
        count: Math.floor(Math.random() * 3),
        holdingPct: Math.random() * 0.1,
      },
      bundles: {
        isBundled: Math.random() > 0.8,
        bundleSupplyPct: Math.random() * 0.05,
      },
    },
    distribution: {
      buckets: {
        whalesOver1pct: Math.floor(Math.random() * 10),
        fishUnder01pct: 100 + Math.floor(Math.random() * 500),
      },
    },
    socialSignals: {
      smartMoneyCount: Math.random() > 0.6 ? Math.floor(Math.random() * 5) : 0,
      whaleCount: Math.floor(Math.random() * 3),
      freshWalletCount: Math.floor(Math.random() * 20),
      tweetSentiment: {
        mentionCount: Math.floor(Math.random() * 50),
        influencerMentions: Math.random() > 0.7 ? ["@Ansem", "@blknoiz06"] : [],
      },
    },
    userExecution: {
      quickBuyDefaults: [0.5, 1.0, 5.0],
      userHolding: {
        isHeld: Math.random() > 0.8,
        balance: Math.floor(Math.random() * 1000000),
        pnlUsd: (Math.random() - 0.3) * 500,
      },
    },
  }
}

export function generateTokens(count: number, stage: TokenStatus): Token[] {
  return Array.from({ length: count }, (_, i) => generateToken(i, stage))
}

export const MOCK_TOKENS: Token[] = [
  ...generateTokens(8, "NEW_PAIRS"),
  ...generateTokens(6, "FINAL_STRETCH"),
  ...generateTokens(5, "MIGRATED"),
]
