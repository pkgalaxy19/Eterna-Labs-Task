"use client"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { updateTokenPrice, clearFlashState, updateBondingProgress } from "@/store/tokenSlice"

export function useWebSocketMock() {
  const dispatch = useDispatch()
  const tokens = useSelector((state: RootState) => state.tokens.entities)
  const tokensRef = useRef(tokens)
  useEffect(() => {
    tokensRef.current = tokens
  }, [tokens])

  useEffect(() => {
    const interval = setInterval(() => {
      const values = Object.values(tokensRef.current)
      if (!values.length) return
      values.forEach((token) => {
        if (Math.random() > 0.7) {
          const isUp = Math.random() > 0.45
          const volatility = Math.random() * 0.03

          const newMarketCap = isUp
            ? token.marketData.marketCap * (1 + volatility)
            : token.marketData.marketCap * (1 - volatility)

          const newSparkline = [
            ...token.marketData.sparkline.slice(1),
            token.marketData.priceUsd * (isUp ? 1 + volatility : 1 - volatility),
          ]

          dispatch(
            updateTokenPrice({
              id: token.id,
              marketCap: newMarketCap,
              flashState: isUp ? "up" : "down",
              sparkline: newSparkline,
            }),
          )

          if (token.lifecycle.stage !== "MIGRATED" && token.lifecycle.bondingCurve.isActive) {
            const newProgress = Math.min(token.lifecycle.bondingCurve.progressPercent + Math.random() * 0.002, 1.0)
            dispatch(
              updateBondingProgress({
                id: token.id,
                progressPercent: newProgress,
                solReserves: newProgress * 85,
              }),
            )
          }
          setTimeout(() => {
            dispatch(clearFlashState(token.id))
          }, 600)
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [dispatch])
}



// "use client"

// import { useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import type { RootState } from "@/store/store"
// import {
//   updateTokenPrice,
//   clearFlashState,
// } from "@/store/tokenSlice"

// export function useTokenWebSocket() {
//   const dispatch = useDispatch()
//   const tokens = useSelector((state: RootState) => state.tokens.entities)

//   useEffect(() => {
//     const ws = new WebSocket(
//       "wss://io.dexscreener.com/dex/screener/pairs"
//     )

//     ws.onopen = () => {
//       console.log(" DexScreener WS connected")
//     }

//     ws.onmessage = (event) => {
//       const payload = JSON.parse(event.data)
//       const pairs = payload?.pairs
//       if (!Array.isArray(pairs)) return

//       pairs.forEach((pair: any) => {
//         const token = tokens[pair.pairAddress]
//         if (!token) return

//         const newPrice = Number(pair.priceUsd)
//         const oldPrice = token.marketData.priceUsd

//         if (!newPrice || newPrice === oldPrice) return

//         const isUp = newPrice > oldPrice
//         const volatility = Math.abs(
//           (newPrice - oldPrice) / oldPrice
//         )

//         const newMarketCap = token.marketData.marketCap * (1 + (isUp ? volatility : -volatility))

//         const newSparkline = [
//           ...token.marketData.sparkline.slice(1),
//           newPrice,
//         ]

//         dispatch(
//           updateTokenPrice({
//             id: token.id,
//             marketCap: newMarketCap,
//             flashState: isUp ? "up" : "down",
//             sparkline: newSparkline,
//           })
//         )

//         setTimeout(() => {
//           dispatch(clearFlashState(token.id))
//         }, 600)
//       })
//     }

//     ws.onerror = (err) => {
//       console.error("WS error", err)
//     }

//     ws.onclose = () => {
//       console.log("DexScreener WS closed")
//     }

//     return () => ws.close()
//   }, [dispatch, tokens])
// }
