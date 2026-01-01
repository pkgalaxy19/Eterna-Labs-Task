"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchTokens } from "@/services/api"
import { useDispatch } from "react-redux"
import { upsertTokens } from "@/store/tokenSlice"

export function useTokensQuery() {
  const dispatch = useDispatch()

  const query = useQuery({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  useEffect(() => {
    if (query.data) {
      dispatch(upsertTokens(query.data))
    }
  }, [query.data, dispatch])

  return {
    ...query,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}





// "use client"

// import { useEffect, useRef } from "react"
// import { useQuery } from "@tanstack/react-query"
// import { fetchTokens } from "@/services/api"
// import { useDispatch } from "react-redux"
// import { upsertTokens } from "@/store/tokenSlice"
// import type { Token } from "@/types/token"

// export function useTokensQuery() {
//   const dispatch = useDispatch()
//   const lastHashRef = useRef<string | null>(null)

//   const query = useQuery<Token[]>({
//     queryKey: ["tokens"],
//     queryFn: fetchTokens,
//     staleTime: 30_000,
//     refetchInterval: 60_000,
//     retry: 3,
//     retryDelay: (attempt) =>
//       Math.min(1000 * 2 ** attempt, 30_000),
//   })

//   useEffect(() => {
//     if (!query.data) return
//     const hash = JSON.stringify(
//       query.data.map(t => [t.id, t.marketData.priceUsd])
//     )
//     if (hash !== lastHashRef.current) {
//       lastHashRef.current = hash
//       dispatch(upsertTokens(query.data))
//     }
//   }, [query.data, dispatch])
//   return query
// }

