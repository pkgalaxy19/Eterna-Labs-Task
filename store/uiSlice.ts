import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { TokenStatus } from "@/types/token"

export type SortKey = "age" | "marketCap" | "liquidity" | "volume" | "score"

interface UIState {
  activeTab: TokenStatus
  sortKey: SortKey
  direction: "asc" | "desc"
  selectedTokenId: string | null
  isLoading: boolean
}

const initialState: UIState = {
  activeTab: "NEW_PAIRS",
  sortKey: "age",
  direction: "asc",
  selectedTokenId: null,
  isLoading: true,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTab(state, action: PayloadAction<TokenStatus>) {
      state.activeTab = action.payload
    },
    setSort(
      state,
      action: PayloadAction<{
        key: SortKey
        direction: "asc" | "desc"
      }>,
    ) {
      state.sortKey = action.payload.key
      state.direction = action.payload.direction
    },
    setSelectedToken(state, action: PayloadAction<string | null>) {
      state.selectedTokenId = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
  },
})

export const { setTab, setSort, setSelectedToken, setLoading } = uiSlice.actions
export default uiSlice.reducer
