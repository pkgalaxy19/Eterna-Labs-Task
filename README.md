# Token Trading Table - Axiom Pulse

A real-time cryptocurrency token trading dashboard built with Next.js, featuring live price updates, sorting, filtering, and responsive design.

## Features

### Core Functionality
- **Three Token Columns**: New Pairs, Final Stretch, and Migrated tokens
- **Real-time Price Updates**: WebSocket integration for live price changes with smooth color transitions (green for up, red for down)
- **Sorting**: Sort tokens by Age, Market Cap, Volume, or Transactions
- **Interactive Popovers**: Bonding curve progress, security audit status, and holder distribution details
- **Token Detail Modal**: Click any token card to view detailed information
- **Sparkline Charts**: Visual price history for each token

### UI/UX
- **Loading States**: Skeleton cards with shimmer animation during data fetching
- **Error Handling**: Error boundaries with retry functionality
- **Responsive Design**: Works on all screen sizes down to 320px (mobile shows tabs, desktop shows columns)
- **Smooth Animations**: Flash effects on price changes, hover states, and transitions

### Technical Implementation
- **React Query**: Data fetching, caching, and automatic refetching
- **Redux Toolkit**: Global state management for tokens and UI state
- **WebSocket**: Real-time price updates (mock implementation included, real DexScreener integration ready)
- **TypeScript**: Full type safety throughout the codebase
- **Tailwind CSS**: Utility-first styling with custom design tokens

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack React Query
- **Styling**: Tailwind CSS
- **Charts**: Recharts (for sparklines)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000/pulse](http://localhost:3000/pulse) to view the dashboard.

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page (redirects to /pulse)
│   └── pulse/
│       └── page.tsx         # Main dashboard page
├── components/
│   ├── atoms/               # Small, reusable components
│   │   ├── BondingPopover.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── HoldersPopover.tsx
│   │   ├── SecurityPopover.tsx
│   │   ├── Sparkline.tsx
│   │   └── Tooltip.tsx
│   ├── molecules/           # Composed components
│   │   ├── SkeletonCard.tsx
│   │   └── TokenDetailModal.tsx
│   └── organisms/           # Complex components
│       ├── PulseColumn.tsx
│       └── TokenCard.tsx
├── hooks/
│   ├── useTokensQuery.ts    # React Query hook for fetching tokens
│   └── useWebSocketMock.ts  # WebSocket mock for real-time updates
├── lib/
│   ├── format.ts            # Number/date formatting utilities
│   ├── sort.ts              # Sorting logic for tokens
│   └── utils.ts             # General utilities (cn function)
├── services/
│   ├── api.ts               # API service (mock implementation)
│   └── mockTokens.ts        # Mock token data generator
├── store/
│   ├── providers.tsx        # Redux + React Query providers
│   ├── store.ts             # Redux store configuration
│   ├── tokenSlice.ts        # Token state management
│   └── uiSlice.ts           # UI state management
└── types/
    └── token.ts             # TypeScript interfaces
```

## Switching to Real Data

The project includes mock data by default. To connect to the real DexScreener API:

### 1. Update API Service (`services/api.ts`)

```typescript
import type { Token } from "@/types/token"
import { mapDexPairToToken } from "@/lib/tokenMapper"

export async function fetchTokens(): Promise<Token[]> {
  const res = await fetch(
    "https://api.dexscreener.com/latest/dex/search?q=solana"
  )
  if (!res.ok) {
    throw new Error("Failed to fetch tokens")
  }
  const data = await res.json()
  const pairs = data.pairs ?? []
  const tokens: Token[] = pairs
    .slice(0, 20)
    .map((pair: any, index: number) =>
      mapDexPairToToken(pair, index)
    )

  return tokens
}
```

### 2. Create Token Mapper (`lib/tokenMapper.ts`)

Create a utility to map DexScreener pair data to your Token interface.

### 3. Real WebSocket Hook (`hooks/useTokenWebSocket.ts`)

```typescript
"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { updateTokenPrice, clearFlashState } from "@/store/tokenSlice"

export function useTokenWebSocket() {
  const dispatch = useDispatch()
  const tokens = useSelector((state: RootState) => state.tokens.entities)

  useEffect(() => {
    const ws = new WebSocket(
      "wss://io.dexscreener.com/dex/screener/pairs"
    )

    ws.onopen = () => {
      console.log("DexScreener WS connected")
    }

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data)
      const pairs = payload?.pairs
      if (!Array.isArray(pairs)) return

      pairs.forEach((pair: any) => {
        const token = tokens[pair.pairAddress]
        if (!token) return

        const newPrice = Number(pair.priceUsd)
        const oldPrice = token.marketData.priceUsd

        if (!newPrice || newPrice === oldPrice) return

        const isUp = newPrice > oldPrice
        const volatility = Math.abs((newPrice - oldPrice) / oldPrice)
        const newMarketCap = token.marketData.marketCap * (1 + (isUp ? volatility : -volatility))
        const newSparkline = [...token.marketData.sparkline.slice(1), newPrice]

        dispatch(
          updateTokenPrice({
            id: token.id,
            marketCap: newMarketCap,
            flashState: isUp ? "up" : "down",
            sparkline: newSparkline,
          })
        )

        setTimeout(() => {
          dispatch(clearFlashState(token.id))
        }, 600)
      })
    }

    ws.onerror = (err) => console.error("WS error", err)
    ws.onclose = () => console.log("DexScreener WS closed")

    return () => ws.close()
  }, [dispatch, tokens])
}
```

### 4. Update useTokensQuery Hook

Replace the mock implementation with real data fetching:

```typescript
"use client"

import { useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchTokens } from "@/services/api"
import { useDispatch } from "react-redux"
import { upsertTokens } from "@/store/tokenSlice"
import type { Token } from "@/types/token"

export function useTokensQuery() {
  const dispatch = useDispatch()
  const lastHashRef = useRef<string | null>(null)

  const query = useQuery<Token[]>({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
  })

  useEffect(() => {
    if (!query.data) return
    const hash = JSON.stringify(
      query.data.map(t => [t.id, t.marketData.priceUsd])
    )
    if (hash !== lastHashRef.current) {
      lastHashRef.current = hash
      dispatch(upsertTokens(query.data))
    }
  }, [query.data, dispatch])

  return query
}
```

## Architecture Decisions

1. **Atomic Design Pattern**: Components organized into atoms, molecules, and organisms for better reusability
2. **Redux for Global State**: Chosen for complex state interactions between WebSocket updates and UI
3. **React Query for Server State**: Handles caching, refetching, and loading states automatically
4. **Memoization**: TokenCard and PulseColumn are memoized to prevent unnecessary re-renders during price updates
5. **Error Boundaries**: Graceful error handling with retry functionality

## Performance Optimizations

- Memoized components with `React.memo`
- Virtualized rendering ready (can be added for large lists)
- Efficient Redux selectors with entity adapter
- Debounced WebSocket updates
- Optimistic UI updates with flash states

## License

MIT
