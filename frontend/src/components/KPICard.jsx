import React from 'react'
import { Tag } from '@carbon/react'

/**
 * KPICard — Carbon Tile-styled metric card with directional trend
 */
export default function KPICard({
  label,
  value,
  unit = '',
  trend,
  trendLabel,
  variant = 'info',  // info | success | warning | danger | purple
  icon: Icon
}) {
  const trendColor = trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-muted'
  const trendArrow = trend > 0 ? '↑' : trend < 0 ? '↓' : '—'

  return (
    <div className={`kpi-card kpi-card--${variant}`} role="region" aria-label={label}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {value}
        {unit && <span style={{ fontSize: '1rem', fontWeight: 400, marginLeft: 4, color: '#a8a8a8' }}>{unit}</span>}
      </div>
      {(trend !== undefined || trendLabel) && (
        <div className={`kpi-trend ${trendColor}`}>
          {trend !== undefined && <span>{trendArrow} {Math.abs(trend)}%</span>}
          {trendLabel && <span style={{ color: '#a8a8a8', marginLeft: 4 }}>{trendLabel}</span>}
        </div>
      )}
      {Icon && (
        <span className="kpi-icon" aria-hidden="true">
          <Icon size={32} />
        </span>
      )}
    </div>
  )
}
