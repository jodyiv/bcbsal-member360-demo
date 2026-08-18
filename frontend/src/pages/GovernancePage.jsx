import React, { useState } from 'react'
import { Tag, Button } from '@carbon/react'
import { ChartNetwork, Security, Catalog, CheckmarkFilled, DataVis_1 } from '@carbon/icons-react'

const LINEAGE_CHAIN = [
  { type: 'Source',      name: 'TriZetto QNXT',     date: 'Nov 1, 2025 04:00 AM',   tool: 'IBM App Connect',          format: 'ANSI X12 837' },
  { type: 'Raw Landing', name: 'raw.clm_837',        date: 'Nov 1, 2025 04:38 AM',   tool: 'watsonx.data Integration', format: 'Parquet'       },
  { type: 'Iceberg',     name: 'member360.clm_header', date: 'Nov 1, 2025 05:12 AM', tool: 'Spark ETL Job',            format: 'Iceberg v2'    },
  { type: 'Enrichment',  name: 'clm_with_risk_flags', date: 'Nov 1, 2025 06:00 AM', tool: 'Spark ML Pipeline',        format: 'Iceberg v2'    },
  { type: 'Semantic',    name: 'member_risk_scores',  date: 'Nov 1, 2025 06:45 AM', tool: 'watsonx.data Intelligence','format': 'Iceberg v2'  },
  { type: 'BI Layer',    name: 'rpt_high_risk_mbrs',  date: 'Nov 1, 2025 07:00 AM', tool: 'Presto View',             format: 'SQL View'      },
]

const CATALOG_ASSETS = [
  { schema: 'member360.enrollment',  asset: 'mbr_enrollment',       owner: 'Enterprise Data Team',  classification: 'PHI — Restricted',   quality: 98, terms: 3 },
  { schema: 'member360.claims',      asset: 'clm_header',           owner: 'Claims Analytics',      classification: 'PHI — Restricted',   quality: 96, terms: 5 },
  { schema: 'member360.claims',      asset: 'clm_diagnosis',        owner: 'Claims Analytics',      classification: 'PHI — Restricted',   quality: 97, terms: 4 },
  { schema: 'member360.pharmacy',    asset: 'rx_adherence_pdc',     owner: 'Pharmacy Analytics',    classification: 'PHI — Restricted',   quality: 94, terms: 3 },
  { schema: 'member360.care',        asset: 'care_interventions',   owner: 'Care Management',       classification: 'PHI — Restricted',   quality: 91, terms: 2 },
  { schema: 'member360.risk',        asset: 'member_risk_scores',   owner: 'Data Science',          classification: 'PHI — Restricted',   quality: 99, terms: 4 },
  { schema: 'member360.hedis',       asset: 'care_gap_registry',    owner: 'Quality Team',          classification: 'PHI — Restricted',   quality: 95, terms: 6 },
  { schema: 'member360.documents',   asset: 'doc_vector_index',     owner: 'Clinical Informatics',  classification: 'PHI — Restricted',   quality: 88, terms: 2 },
]

const POLICY_RULES = [
  { rule: 'PHI Masking',             applies: 'All Iceberg tables in member360 schema', action: 'Mask SSN, DOB, phone in non-privileged roles', status: 'active' },
  { rule: 'Care Manager Access',     applies: 'member_risk_scores, care_interventions', action: 'Row-level filter: assigned members only', status: 'active' },
  { rule: 'Audit Logging',           applies: 'All PHI tables',                         action: 'All reads logged to IBM Log Analysis', status: 'active' },
  { rule: 'Retention — Claims',      applies: 'clm_header, clm_diagnosis',              action: 'Auto-archive to cold tier after 7 years', status: 'active' },
  { rule: 'HIPAA Minimum Necessary', applies: 'doc_vector_index (vector store)',         action: 'AI responses limited to authorized member scope', status: 'active' },
  { rule: 'NCQA Data Stewardship',   applies: 'care_gap_registry',                      action: 'Change approval required; versioned in Iceberg', status: 'active' },
]

import DataTableView from '../components/DataTableView.jsx'

const CATALOG_HEADERS = [
  { key: 'schema',         header: 'Schema'          },
  { key: 'asset',          header: 'Table / Asset'   },
  { key: 'owner',          header: 'Data Owner'      },
  { key: 'classification', header: 'Classification'  },
  { key: 'quality',        header: 'Quality Score'   },
  { key: 'terms',          header: 'Governance Terms' },
]

const POLICY_HEADERS = [
  { key: 'rule',    header: 'Policy Rule'    },
  { key: 'applies', header: 'Applies To'    },
  { key: 'action',  header: 'Enforcement'   },
  { key: 'status',  header: 'Status'        },
]

export default function GovernancePage() {
  const [activeLineageNode, setActiveLineageNode] = useState(null)

  return (
    <div>
      <div className="page-header">
        <h1>Data Governance &amp; Lineage — watsonx.data Intelligence SaaS</h1>
        <p>
          <strong>watsonx.data Intelligence SaaS</strong> (IBM Knowledge Catalog on watsonx.data) automatically profiles
          all Iceberg tables, generates a metadata catalog, enforces data quality rules, and produces end-to-end lineage
          graphs — from TriZetto source through ML enrichment to BI views. All without manual documentation effort.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <Tag type="blue"   size="sm">IBM Knowledge Catalog on watsonx.data</Tag>
          <Tag type="purple" size="sm">Auto-Generated Metadata</Tag>
          <Tag type="teal"   size="sm">End-to-End Data Lineage</Tag>
          <Tag type="cyan"   size="sm">HIPAA Policy Enforcement</Tag>
          <Tag type="green"  size="sm">Automated Data Quality</Tag>
        </div>
      </div>

      {/* ── End-to-End Lineage Flow ──────────────────────── */}
      <div className="data-section section-spacer">
        <h4><ChartNetwork size={16} /> End-to-End Data Lineage — Claims Risk Score Pipeline</h4>
        <p style={{ fontSize: '0.8125rem', color: '#a8a8a8', margin: '0 0 1rem' }}>
          watsonx.data Intelligence automatically traces each data asset from its source system through
          every transformation to its final BI consumption layer. Click a node to see details.
        </p>
        <div className="lineage-flow" role="list" aria-label="Data lineage flow">
          {LINEAGE_CHAIN.map((node, i) => (
            <div
              key={i}
              className="lineage-node"
              onClick={() => setActiveLineageNode(activeLineageNode === i ? null : i)}
              role="listitem"
              tabIndex={0}
              aria-expanded={activeLineageNode === i}
              aria-label={`Lineage node: ${node.name}`}
              onKeyDown={e => { if (e.key === 'Enter') setActiveLineageNode(activeLineageNode === i ? null : i) }}
              style={{
                cursor: 'pointer',
                borderColor: activeLineageNode === i ? '#0f62fe' : '#525252',
                borderWidth: activeLineageNode === i ? 2 : 1,
                borderStyle: 'solid'
              }}
            >
              <div className="node-type">
                <Tag type={
                  node.type === 'Source' ? 'blue' :
                  node.type === 'Iceberg' ? 'purple' :
                  node.type === 'Enrichment' ? 'teal' :
                  node.type === 'Semantic' ? 'cyan' :
                  node.type === 'BI Layer' ? 'green' : 'gray'
                } size="sm">{node.type}</Tag>
              </div>
              <div className="node-name">{node.name}</div>
              <div className="node-date" style={{ fontSize: '0.6875rem' }}>{node.tool}</div>
            </div>
          ))}
        </div>

        {activeLineageNode !== null && (
          <div style={{ padding: '1rem', background: '#262626', border: '1px solid #0f62fe', marginTop: '0.5rem' }}>
            <strong style={{ color: '#78a9ff' }}>{LINEAGE_CHAIN[activeLineageNode].name}</strong>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#a8a8a8' }}>
              <span>Type: <strong style={{ color: '#f4f4f4' }}>{LINEAGE_CHAIN[activeLineageNode].type}</strong></span>
              <span>Format: <strong style={{ color: '#f4f4f4' }}>{LINEAGE_CHAIN[activeLineageNode].format}</strong></span>
              <span>Tool: <strong style={{ color: '#f4f4f4' }}>{LINEAGE_CHAIN[activeLineageNode].tool}</strong></span>
              <span>Timestamp: <strong style={{ color: '#f4f4f4' }}>{LINEAGE_CHAIN[activeLineageNode].date}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* ── Intelligent Catalog ──────────────────────────── */}
      <div className="section-spacer">
        <DataTableView
          title="Intelligent Data Catalog — watsonx.data Intelligence SaaS"
          description="Auto-profiled assets: IBM Knowledge Catalog discovers tables, generates column-level metadata, assigns governance terms, and scores data quality automatically."
          headers={CATALOG_HEADERS}
          rows={CATALOG_ASSETS.map((r, i) => ({
            id: String(i),
            ...r,
            quality: `${r.quality}/100`,
            terms: `${r.terms} terms assigned`
          }))}
          statusKey="classification"
          pageSize={10}
          showExport={false}
        />
      </div>

      {/* ── Policy Rules ─────────────────────────────────── */}
      <div className="section-spacer">
        <DataTableView
          title="Active Governance Policies — HIPAA + NCQA Enforcement"
          description="Policy rules enforced automatically by watsonx.data Intelligence across all Iceberg tables. No manual tagging required."
          headers={POLICY_HEADERS}
          rows={POLICY_RULES.map((r, i) => ({ id: String(i), ...r }))}
          statusKey="status"
          pageSize={10}
          showExport={false}
        />
      </div>

      {/* ── Intelligence Capabilities ─────────────────────── */}
      <div className="data-section">
        <h4><Catalog size={16} /> watsonx.data Intelligence SaaS — Capability Summary</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
          {[
            { title: 'Automated Profiling',       body: 'Column-level profiling (null rates, distributions, uniqueness, PII detection) runs on every Iceberg table load — zero configuration.',          icon: '🔍', color: '#0f62fe' },
            { title: 'Semantic Discovery',         body: 'Natural language search across all 10 Iceberg tables + vector store. Analysts find data assets in seconds without knowing table names.',        icon: '🔎', color: '#6929c4' },
            { title: 'End-to-End Lineage',         body: 'Automatic lineage from source to BI view across Spark, Presto, and App Connect transformations. Impact analysis for any schema change.',        icon: '🔗', color: '#005d5d' },
            { title: 'Data Quality Scoring',       body: 'Continuous quality rules (completeness, referential integrity, range checks) scored per asset. Alerts on quality degradation.',                icon: '✅', color: '#198038' },
            { title: 'PHI Classification',         body: 'Auto-detects and classifies PHI fields (SSN, DOB, diagnosis codes) using NLP pattern matching. Enforces masking policies dynamically.',       icon: '🔒', color: '#9f1853' },
            { title: 'AI-Ready Metadata',          body: 'Business glossary terms, semantic labels, and vector embeddings make every asset immediately consumable by watsonx.ai and the AI assistant.',  icon: '🤖', color: '#b28600' },
          ].map(c => (
            <div key={c.title} style={{ padding: '1rem', background: '#3d3d3d', borderTop: `3px solid ${c.color}` }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{c.icon}</div>
              <h5 style={{ margin: '0 0 0.5rem', color: '#f4f4f4', fontSize: '0.9375rem' }}>{c.title}</h5>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#a8a8a8', lineHeight: 1.5 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
