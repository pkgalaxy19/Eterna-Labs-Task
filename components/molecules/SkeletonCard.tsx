"use client"

export function SkeletonCard() {
  return (
    <div className="bg-[#0f0f11] border border-white/5 rounded-xl w-full p-3 flex flex-col gap-3 relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-lg bg-zinc-800/50 animate-pulse" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3.5 w-16 bg-zinc-800/50 rounded animate-pulse" />
          <div className="h-2.5 w-24 bg-zinc-800/50 rounded animate-pulse" />
        </div>
        <div className="w-14 h-5 bg-zinc-800/50 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-14 bg-zinc-800/50 rounded-md animate-pulse" />
        <div className="h-14 bg-zinc-800/50 rounded-md animate-pulse" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-14 bg-zinc-800/50 rounded animate-pulse" />
        <div className="h-5 w-10 bg-zinc-800/50 rounded animate-pulse" />
        <div className="h-5 w-12 bg-zinc-800/50 rounded animate-pulse" />
      </div>
      <div className="h-1.5 w-full bg-zinc-800/50 rounded-full animate-pulse" />
      <div className="flex gap-1.5 mt-1">
        <div className="flex-1 h-8 bg-zinc-800/50 rounded animate-pulse" />
        <div className="flex-1 h-8 bg-zinc-800/50 rounded animate-pulse" />
        <div className="flex-[1.5] h-8 bg-zinc-800/50 rounded animate-pulse" />
      </div>
    </div>
  )
}
