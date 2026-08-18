import React, { useEffect, useState } from 'react'
import { Tag, Loading, Tile } from '@carbon/react'
import { LineChart } from '@carbon/charts-react'
import { DonutChart } from '@carbon/charts-react'
import { GroupedBarChart } from '@carbon/charts-react'
import {
  Dashboard as DashboardIcon,
  WatsonHealthAiResults,
  DataBase,
  Warning,
  Checkmark,
  Activity
} from '@carbon/icons-react'
import KPICard from '../components/KPICard.jsx'
import DataTableView from '../components/DataTableView.jsx'
import { fetchDashboardData } from '../services/dataService.js'
import { useDemoContext } from '../context/DemoContext.jsx'
import { fmt } from '../utils/formatters.js'

const ALERT_HEADERS = [
  { key: 'member',    header: 'Member'         },
  { key: 'id_num',    header: 'Member ID'      },
  { key: 'condition', header: 'Condition(s)'   },
  { key: 'risk',      header: 'Risk Score'     },
  { key: 'action',    header: 'Recommended Action' },
  { key: 'status',    header: 'Status'         },
]

const INGESTION_HEADERS = [
  { key: 'source',  header: 'Source System'     },
  { key: 'system',  header: 'Platform'          },
  { key: 'records', header: 'Records Loaded'    },
  { key: 'latency', header: 'Refresh Cadence'   },
  { key: 'format',  header: 'Lakehouse Format'  },
  { key: 'status',  header: 'Status'            },
]

export default function ExecutivePage() {
  const { state } = useDemoContext()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData(state.demoMode)
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [state.demoMode])

  if (loading) return (
    <div className="loading-indicator">
      <Loading description="Loading executive dashboard…" withOverlay={false} />
      <span>Querying watsonx.data Iceberg lakehouse…</span>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <h1>Executive Dashboard — BCBS AL Member 360 Lakehouse</h1>
        <p>
          Unified member intelligence across 6 source systems via{' '}
          <strong>watsonx.data SaaS</strong> (Iceberg lakehouse) ·{' '}
          <strong>watsonx.data Integration SaaS</strong> (pipeline) ·{' '}
          <strong>watsonx.data Intelligence SaaS</strong> (AI enrichment &amp; governance).
          All data is synthetic and for demonstration purposes only.
        </p>

        {/* IBM Product Stack Badges */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <Tag type="blue"    size="sm">watsonx.data SaaS — Iceberg Lakehouse</Tag>
          <Tag type="purple"  size="sm">watsonx.data Integration SaaS — Pipelines</Tag>
          <Tag type="teal"    size="sm">watsonx.data Intelligence SaaS — Governance &amp; AI</Tag>
          <Tag type="green"   size="sm">6 Source Systems Connected</Tag>
          <Tag type="magenta" size="sm">132,000 Members</Tag>
        </div>
      </div>

      {/* ── Value Narrative ────────────────────────────────── */}
      <div className="value-narrative" role="note">
        <blockquote>
          "The Lakehouse enables BCBS AL to create a Member 360 experience that combines structured claims and enrollment data
          with unstructured clinical content, delivering faster member insights, improved care-management effectiveness,
          and an AI-ready foundation without waiting for a multi-year platform transformation."
        </blockquote>
        <cite>— Executive Value Narrative · BCBS AL Lakehouse Initiative</cite>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div className="kpi-grid">
        {data.kpis.map(k => (
          <KPICard
            key={k.id}
            label={k.label}
            value={k.value}
            unit={k.unit}
            trend={k.trend}
            trendLabel={k.trendLabel}
            variant={k.variant}
            icon={k.id === 'high_risk' ? Warning : k.id === 'care_gaps' ? Checkmark : k.id === 'ai_score' ? WatsonHealthAiResults : Activity}
          />
        ))}
      </div>

      {/* ── Charts Row 1 ───────────────────────────────────── */}
      <div className="charts-grid">
        <div className="chart-tile">
          <h5>Cost Trend — Presto SQL on Iceberg</h5>
          <LineChart data={data.costTrendChart.data} options={data.costTrendChart.options} />
        </div>
        <div className="chart-tile">
          <h5>Risk Stratification — Intelligence Risk Model</h5>
          <DonutChart
            data={data.riskDistChart.data}
            options={data.riskDistChart.options}
          />
        </div>
      </div>

      {/* ── Care Gaps Chart ─────────────────────────────────── */}
      <div className="chart-tile section-spacer">
        <h5>HEDIS Care Gaps by Measure — Open vs. Closed</h5>
        <GroupedBarChart data={data.careGapChart.data} options={data.careGapChart.options} />
      </div>

      {/* ── High-Risk Alerts Table ──────────────────────────── */}
      <div className="section-spacer">
        <DataTableView
          title="High-Risk Member Alerts"
          description="Members flagged by watsonx.data Intelligence risk model — requiring care manager action"
          headers={ALERT_HEADERS}
          rows={data.alerts.map(r => ({ ...r, risk: `${r.risk} / 100` }))}
          statusKey="status"
          pageSize={5}
        />
      </div>

      {/* ── Ingestion Pipeline Summary ────────────────────────── */}
      <div className="section-spacer">
        <DataTableView
          title="Lakehouse Ingestion Pipeline — watsonx.data Integration SaaS"
          description="All 6 source systems connected via IBM App Connect on watsonx.data Integration; data lands in Apache Iceberg tables"
          headers={INGESTION_HEADERS}
          rows={data.ingestionSummary.map((r, i) => ({ id: String(i), ...r }))}
          statusKey="status"
          pageSize={10}
          showExport={false}
        />
      </div>

      {/* ── Time-to-Value Timeline ──────────────────────────── */}
      <div className="section-spacer">
        <div className="data-section">
          <h4><Activity size={16} /> Time to Value — Lakehouse Implementation Milestones</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', padding: '0.5rem 0' }}>
            {data.timeToValue.map(m => (
              <div key={m.milestone} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag
                  type={m.status === 'completed' ? 'green' : m.status === 'inprogress' ? 'blue' : 'gray'}
                  size="sm"
                >
                  {m.status === 'completed' ? '✓' : m.status === 'inprogress' ? '▶' : '○'} Week {m.week}: {m.milestone}
                </Tag>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
