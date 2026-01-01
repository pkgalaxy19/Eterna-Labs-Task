export function formatPrice(value: number): string {
  if (value < 0.00001) return `$${value.toExponential(2)}`
  if (value < 0.01) return `$${value.toFixed(6)}`
  if (value < 1) return `$${value.toFixed(4)}`
  return `$${value.toFixed(2)}`
}

export function formatCash(n: number): string {
  if (n < 1e3) return n.toFixed(2)
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K"
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M"
  return +(n / 1e9).toFixed(1) + "B"
}

export function formatCompact(value: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatAge(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`
  return `${Math.floor(minutes / 1440)}d`
}

export function formatAddress(addr: string): string {
  if (!addr) return ""
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}
