import React, { useState } from 'react'
import { Tag, Button, Loading, ProgressIndicator, ProgressStep } from '@carbon/react'
import {
  DataStructured, CloudDownload, Checkmark, Warning,
  Document, Medication, UserMultiple,
  Enterprise, DataBase, Activity
} from '@carbon/icons-react'
import { useDemoContext } from '../context/DemoContext.jsx'
import { DASHBOARD_MOCK } from '../data/mockResponses/dashboardMocks.js'

const SOURCE_SYSTEMS = [
  { id: 'enrollment', icon: UserMultiple, label: 'Member Enrollment', platform: 'Enrollware', records: '132,000', color: '#0f62fe', format: 'CDC/834 EDI', connector: 'IBM App Connect' },
  { id: 'claims',     icon: Enterprise,  label: 'Medical Claims',    platform: 'TriZetto QNXT', records: '4.8M', color: '#6929c4', format: 'ANSI X12 837', connector: 'IBM App Connect' },
  { id: 'provider',   icon: UserMultiple, label: 'Provider Network', platform: 'CAQH ProView', records: '28,400', color: '#005d5d', format: 'FHIR R4 JSON', connector: 'IBM App Connect' },
  { id: 'care',       icon: Activity,    label: 'Care Management',   platform: 'CareEdge CM', records: '18,200', color: '#9f1853', format: 'REST API',    connector: 'IBM App Connect' },
  { id: 'pharmacy',   icon: Medication,  label: 'Pharmacy Claims',   platform: 'MedImpact PBM', records: '2.1M', color: '#198038', format: 'NCPDP D.0',  connector: 'IBM App Connect' },
  { id: 'documents',  icon: Document,    label: 'Clinical Documents',platform: 'Content Repository', records: '94K docs', color: '#b28600', format: 'PDF/TIFF/XML', connector: 'watsonx.data Intelligence' },
]

const PIPELINE_STAGES = [
  { id: 's1', label: 'Source Extract',      detail: 'IBM App Connect pulls from 5 structured + 1 document source on schedule',        status: 'complete' },
  { id: 's2', label: 'Schema Mapping',      detail: 'watsonx.data Integration maps source schemas to unified Member 360 canonical model', status: 'complete' },
  { id: 's3', label: 'Iceberg Landing',     detail: 'Data lands in Apache Iceberg tables on IBM Cloud Object Storage (S3-compatible)',   status: 'complete' },
  { id: 's4', label: 'Presto/Spark Query',  detail: 'Presto (OLAP) + Spark (ETL) engines registered in watsonx.data query service',    status: 'complete' },
  { id: 's5', label: 'Document Vectorize',  detail: 'watsonx.data Intelligence NLP extracts entities from PDFs, indexes to vector store', status: 'inprogress' },
  { id: 's6', label: 'Catalog & Lineage',   detail: 'watsonx.data Intelligence auto-generates metadata, data dictionary, lineage graph',  status: 'pending' },
]

const ICEBERG_TABLES = [
  { schema: 'member360.enrollment',    table: 'mbr_enrollment',     rows: '132,000',  refresh: 'Daily',      engine: 'Presto + Spark' },
  { schema: 'member360.claims',        table: 'clm_header',         rows: '4.8M',     refresh: '4-hr batch', engine: 'Presto'         },
  { schema: 'member360.claims',        table: 'clm_diagnosis',      rows: '18.4M',    refresh: '4-hr batch', engine: 'Presto'         },
  { schema: 'member360.pharmacy',      table: 'rx_claims',          rows: '2.1M',     refresh: '4-hr batch', engine: 'Presto'         },
  { schema: 'member360.pharmacy',      table: 'rx_adherence_pdc',   rows: '132,000',  refresh: 'Daily',      engine: 'Spark'          },
  { schema: 'member360.provider',      table: 'provider_directory', rows: '28,400',   refresh: 'Weekly',     engine: 'Presto'         },
  { schema: 'member360.care',          table: 'care_interventions', rows: '18,200',   refresh: 'Hourly',     engine: 'Presto'         },
  { schema: 'member360.risk',          table: 'member_risk_scores', rows: '132,000',  refresh: 'Daily',      engine: 'Spark ML'       },
  { schema: 'member360.hedis',         table: 'care_gap_registry',  rows: '56,254',   refresh: 'Daily',      engine: 'Spark'          },
  { schema: 'member360.documents',     table: 'doc_vector_index',   rows: '94,000',   refresh: 'Continuous', engine: 'Intelligence'   },
]

const TABLE_HEADERS = [
  { key: 'schema',  header: 'Schema'          },
  { key: 'table',   header: 'Iceberg Table'   },
  { key: 'rows',    header: 'Row Count'       },
  { key: 'refresh', header: 'Refresh Cadence' },
  { key: 'engine',  header: 'Query Engine'    },
]

import DataTableView from '../components/DataTableView.jsx'

export default function IngestionPage() {
  const { state, dispatch } = useDemoContext()
  const [runningIngestion, setRunningIngestion] = useState(false)
  const [ingestionComplete, setIngestionComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(4) // 0-indexed; step 5 in progress

  const simulateIngestion = () => {
    setRunningIngestion(true)
    setCurrentStep(4)
    let step = 4
    const interval = setInterval(() => {
      step++
      setCurrentStep(step)
      if (step >= PIPELINE_STAGES.length - 1) {
        clearInterval(interval)
        setRunningIngestion(false)
        setIngestionComplete(true)
        dispatch({ type: 'SET_INGESTION_STATUS', payload: { documents: 'completed' } })
      }
    }, 1200)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Lakehouse Ingestion — watsonx.data Integration SaaS</h1>
        <p>
          IBM App Connect connectors (part of watsonx.data Integration SaaS) ingest structured data from 5 operational systems
          and unstructured clinical documents from the enterprise content repository — all landing in Apache Iceberg tables
          managed by <strong>watsonx.data SaaS</strong>.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <Tag type="blue"   size="sm">Apache Iceberg — Open Table Format</Tag>
          <Tag type="purple" size="sm">IBM App Connect — 100+ Connectors</Tag>
          <Tag type="teal"   size="sm">Presto + Apache Spark Query Engines</Tag>
          <Tag type="cyan"   size="sm">IBM Cloud Object Storage</Tag>
        </div>
      </div>

      {/* ── Step 1: Fragmented Source Systems ──────────────── */}
      <div className="data-section section-spacer">
        <h4><DataBase size={16} /> Step 1 — Current State: Fragmented Source Systems</h4>
        <p style={{ fontSize: '0.875rem', color: '#a8a8a8', marginBottom: '1.25rem' }}>
          Member data exists across 6 disconnected systems. Care managers must consult each individually. There is no unified view.
        </p>
        <div className="source-systems-grid">
          {SOURCE_SYSTEMS.map(s => (
            <div key={s.id} className={`source-system-card source-system-card--${s.id}`}>
              <s.icon size={24} style={{ color: s.color }} aria-hidden="true" />
              <h5>{s.label}</h5>
              <p>{s.platform}</p>
              <div className="system-count">{s.records}</div>
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Tag type="gray" size="sm">{s.format}</Tag>
                <Tag type="blue" size="sm">{s.connector}</Tag>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '1rem', background: '#3d1414', border: '1px solid #da1e28', borderRadius: '2px' }}>
          <strong style={{ color: '#fa4d56' }}>Business Pain:</strong>
          <span style={{ color: '#a8a8a8', marginLeft: '0.5rem' }}>
            A care manager investigating a high-risk member today must log into 6 separate systems,
            manually correlate records, and often copy data into a spreadsheet. Average investigation time: <strong style={{color:'#f4f4f4'}}>47 minutes</strong>.
            After lakehouse: <strong style={{color:'#42be65'}}>under 4 minutes</strong>.
          </span>
        </div>
      </div>

      {/* ── Step 2: Pipeline Stages ─────────────────────────── */}
      <div className="data-section section-spacer">
        <h4><CloudDownload size={16} /> Step 2 — watsonx.data Integration Pipeline Stages</h4>
        <div style={{ margin: '1rem 0' }}>
          <ProgressIndicator currentIndex={currentStep} spaceEqually>
            {PIPELINE_STAGES.map((stage, i) => (
              <ProgressStep
                key={stage.id}
                label={stage.label}
                description={stage.detail}
                complete={i < currentStep}
                current={i === currentStep}
                disabled={i > currentStep}
              />
            ))}
          </ProgressIndicator>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1.5rem' }}>
          <Button
            kind="primary"
            renderIcon={runningIngestion ? Loading : CloudDownload}
            disabled={runningIngestion}
            onClick={simulateIngestion}
            aria-label="Simulate document ingestion pipeline"
          >
            {runningIngestion ? 'Running pipeline…' : ingestionComplete ? 'Re-run Document Pipeline' : 'Run Document Ingestion'}
          </Button>
          {ingestionComplete && (
            <Tag type="green" size="md">
              <Checkmark size={16} /> All 6 sources ingested — 10 Iceberg tables populated
            </Tag>
          )}
        </div>
      </div>

      {/* ── Iceberg Table Registry ──────────────────────────── */}
      <div className="section-spacer">
        <DataTableView
          title="Iceberg Table Registry — watsonx.data Catalog"
          description="Apache Iceberg tables registered in the watsonx.data metastore. Queryable via Presto (OLAP) and Spark (ETL/ML)."
          headers={TABLE_HEADERS.concat([{ key: 'schema', header: 'Schema' }])}
          rows={ICEBERG_TABLES.map((r, i) => ({ id: String(i), ...r }))}
          statusKey="engine"
          pageSize={10}
        />
      </div>

      {/* ── Architecture Note ───────────────────────────────── */}
      <div className="data-section">
        <h4><DataStructured size={16} /> watsonx.data SaaS Architecture — Lakehouse Stack</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
          {[
            { title: 'Storage Layer', body: 'Apache Iceberg tables on IBM Cloud Object Storage. Open format — no vendor lock-in. Supports time-travel queries and schema evolution.', color: '#0f62fe' },
            { title: 'Query Engines', body: 'Presto for interactive BI queries (sub-second). Apache Spark for large-scale ETL and ML pipelines. Both registered in watsonx.data catalog.', color: '#6929c4' },
            { title: 'Federation', body: 'Native connectors to Db2, PostgreSQL, MongoDB, S3, and external REST APIs without data movement — query data where it lives.', color: '#005d5d' },
          ].map(c => (
            <div key={c.title} style={{ padding: '1rem', background: '#3d3d3d', borderTop: `3px solid ${c.color}` }}>
              <h5 style={{ margin: '0 0 0.5rem', color: '#f4f4f4' }}>{c.title}</h5>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#a8a8a8', lineHeight: 1.5 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
