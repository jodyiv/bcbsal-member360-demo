export const fmt = {
  currency: (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v),
  number:   (v) => new Intl.NumberFormat('en-US').format(v),
  pct:      (v) => `${v}%`,
  date:     (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  shortDate:(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
}

export function riskColor(score) {
  if (score >= 80) return '#da1e28'
  if (score >= 60) return '#f1c21b'
  return '#24a148'
}

export function adherenceClass(pct) {
  if (pct >= 80) return 'high'
  if (pct >= 60) return 'medium'
  return 'low'
}
