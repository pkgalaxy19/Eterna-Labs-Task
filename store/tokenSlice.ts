import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Token } from "@/types/token"

interface TokenState {
  entities: Record<string, Token>
  ids: string[]
}

const initialState: TokenState = {
  entities: {},
  ids: [],
}

const tokenSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    upsertTokens(state, action: PayloadAction<Token[]>) {
      for (const token of action.payload) {
        if (!state.entities[token.id]) {
          state.ids.push(token.id)
        }
        state.entities[token.id] = token
      }
    },
    updateTokenPrice(
      state,
      action: PayloadAction<{
        id: string
        marketCap: number
        flashState: "up" | "down" | null
        sparkline?: number[]
      }>,
    ) {
      const token = state.entities[action.payload.id]
      if (!token) return

      token.marketData.marketCap = action.payload.marketCap
      token.flashState = action.payload.flashState
      if (action.payload.sparkline) {
        token.marketData.sparkline = action.payload.sparkline
      }
    },
    updateBondingProgress(
      state,
      action: PayloadAction<{
        id: string
        progressPercent: number
        solReserves: number
      }>,
    ) {
      const token = state.entities[action.payload.id]
      if (!token) return

      token.lifecycle.bondingCurve.progressPercent = action.payload.progressPercent
      token.lifecycle.bondingCurve.solReserves = action.payload.solReserves
    },
    clearFlashState(state, action: PayloadAction<string>) {
      const token = state.entities[action.payload]
      if (token) {
        token.flashState = null
      }
    },
  },
})

export const { upsertTokens, updateTokenPrice, updateBondingProgress, clearFlashState } = tokenSlice.actions

export default tokenSlice.reducer
