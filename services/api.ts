import { generateTokens } from "./mockTokens"
import type { Token } from "@/types/token"

export async function fetchTokens(): Promise<Token[]> {
  // Simulate API latency
  await new Promise((r) => setTimeout(r, 1500))

  return [...generateTokens(8, "NEW_PAIRS"), ...generateTokens(6, "FINAL_STRETCH"), ...generateTokens(5, "MIGRATED")]
}


// import type { Token } from "@/types/token"
// import { mapDexPairToToken } from "../lib/tokenMapper"

// export async function fetchTokens(): Promise<Token[]> {
//   const res = await fetch(
//     "https://api.dexscreener.com/latest/dex/search?q=solana"
//   )
//   if (!res.ok) {
//     throw new Error("Failed to fetch tokens")
//   }
//   const data = await res.json()
//   const pairs = data.pairs ?? []
//   const tokens: Token[] = pairs
//     .slice(0, 20)
//     .map((pair: any, index: number) =>
//       mapDexPairToToken(pair, index)
//     )

//   return tokens
// }