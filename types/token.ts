export type TokenStatus = "NEW_PAIRS" | "FINAL_STRETCH" | "MIGRATED"

export type PlatformBadge = "pump_fun" | "raydium"

export interface TokenIdentity {
  symbol: string
  name: string
  iconUrl: string
  iconShape: "square" | "circle"
  platformBadge: PlatformBadge
  socials: {
    twitter?: string
    website?: string
    telegram?: string
  }
}

export interface BondingCurve {
  isActive: boolean
  progressPercent: number
  solReserves: number
  migrationThreshold: number
  timeToFillEst: number
}

export interface Lifecycle {
  stage: TokenStatus
  createdAtTs: number
  ageHumanReadable: string
  bondingCurve: BondingCurve
}

export interface Volume {
  v5m: number
  v1h: number
  direction: "BUY_HEAVY" | "SELL_HEAVY" | "NEUTRAL"
}

export interface Transactions {
  buys5m: number
  sells5m: number
  ratio: number
}

export interface MarketData {
  priceUsd: number
  priceSol: number
  marketCap: number
  liquidityUsd: number
  volume: Volume
  transactions: Transactions
  sparkline: number[]
}

export interface Deployer {
  address: string
  holdingPct: number
  isSelling: boolean
  tags: string[]
}

export interface Snipers {
  count: number
  totalSupplySniped: number
  status: "LOW_RISK" | "MEDIUM_RISK" | "HIGH_RISK"
}

export interface Insiders {
  count: number
  holdingPct: number
}

export interface Bundles {
  isBundled: boolean
  bundleSupplyPct: number
}

export interface SecurityForensics {
  score: number
  isHoneypot: boolean
  mintAuthDisabled: boolean
  freezeAuthDisabled: boolean
  deployer: Deployer
  snipers: Snipers
  insiders: Insiders
  bundles: Bundles
}

export interface Distribution {
  buckets: {
    whalesOver1pct: number
    fishUnder01pct: number
  }
}

export interface TweetSentiment {
  mentionCount: number
  influencerMentions: string[]
}

export interface SocialSignals {
  smartMoneyCount: number
  whaleCount: number
  freshWalletCount: number
  tweetSentiment: TweetSentiment
}

export interface UserHolding {
  isHeld: boolean
  balance: number
  pnlUsd: number
}

export interface UserExecution {
  quickBuyDefaults: number[]
  userHolding: UserHolding
}

export interface Token {
  id: string
  timestamp: number
  sequenceId: number
  flashState: "up" | "down" | null
  tokenIdentity: TokenIdentity
  lifecycle: Lifecycle
  marketData: MarketData
  securityForensics: SecurityForensics
  distribution: Distribution
  socialSignals: SocialSignals
  userExecution: UserExecution
}
