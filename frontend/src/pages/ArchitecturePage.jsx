import React, { useEffect, useRef } from 'react'
import { Tag } from '@carbon/react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor:   '#1d3461',
    primaryTextColor: '#f4f4f4',
    primaryBorderColor: '#4589ff',
    lineColor:      '#4589ff',
    secondaryColor: '#2c2c2c',
    tertiaryColor:  '#3d3d3d',
    background:     '#262626',
    mainBkg:        '#1d3461',
    nodeBorder:     '#4589ff',
    clusterBkg:     '#1c1c1c',
    clusterBorder:  '#525252',
    titleColor:     '#f4f4f4',
    edgeLabelBackground: '#262626',
    fontFamily: "'IBM Plex Sans', sans-serif"
  },
  flowchart: { curve: 'basis', padding: 20, htmlLabels: true }
})

const DIAGRAM = `
flowchart TB
  subgraph SRC["Source Systems"]
    direction LR
    E1[Enrollware - Enrollment]
    E2[TriZetto QNXT - Claims]
    E3[CAQH ProView - Providers]
    E4[CareEdge - Care Mgmt]
    E5[MedImpact PBM - Pharmacy]
    E6[Content Repo - Clinical Docs]
  end

  subgraph INT["watsonx.data Integration SaaS"]
    direction LR
    C1[EDI 834 Connector]
    C2[ANSI X12 837 Connector]
    C3[FHIR R4 Connector]
    C4[REST API Connector]
    C5[NCPDP D.0 Connector]
    C6[OCR + NLP Extractor]
  end

  subgraph LH["watsonx.data SaaS - Iceberg Lakehouse"]
    direction TB
    subgraph STORE["IBM Cloud Object Storage"]
      I1[(mbr_enrollment)]
      I2[(clm_header)]
      I3[(rx_adherence_pdc)]
      I4[(care_interventions)]
      I5[(member_risk_scores)]
      I6[(doc_vector_index)]
    end
    subgraph ENG["Query Engines"]
      P1[Presto - Interactive SQL]
      SP[Apache Spark - ETL + ML]
    end
  end

  subgraph INTEL["watsonx.data Intelligence SaaS"]
    direction LR
    CAT[Knowledge Catalog]
    LIN[Data Lineage]
    GOV[Policy Engine]
    NLPS[NLP + Vector Search]
    RSK[Risk Scoring Model]
  end

  subgraph BIZ["Business Value Outputs"]
    direction LR
    M360[Member 360]
    HEDIS[HEDIS Gap Detection]
    ASSIST[AI Assistant]
    EXEC[Executive Dashboard]
    CM[Care Manager Workflow]
  end

  E1 --> C1 --> I1
  E2 --> C2 --> I2
  E3 --> C3 --> I1
  E4 --> C4 --> I4
  E5 --> C5 --> I3
  E6 --> C6 --> I6

  I1 & I2 & I3 & I4 --> SP --> I5
  I1 & I2 & I3 & I4 & I5 & I6 --> P1

  P1 --> INTEL
  SP --> INTEL

  INTEL --> M360
  INTEL --> HEDIS
  INTEL --> ASSIST
  INTEL --> EXEC
  INTEL --> CM

  style SRC   fill:#1c2433,stroke:#4589ff
  style INT   fill:#1c2933,stroke:#8a3ffc
  style LH    fill:#1c3029,stroke:#24a148
  style INTEL fill:#331c33,stroke:#be95ff
  style BIZ   fill:#1c2c1c,stroke:#42be65
  style STORE fill:#0f2018,stroke:#24a148
  style ENG   fill:#192024,stroke:#4589ff
`

const COMPONENT_INVENTORY = [
  { layer: 'Source',      component: 'TriZetto QNXT',                 role: 'Medical & pharmacy claims adjudication',         type: 'Existing System',           ibmProduct: '—' },
  { layer: 'Source',      component: 'CareEdge CM',                   role: 'Care management & case tracking',                type: 'Existing System',           ibmProduct: '—' },
  { layer: 'Source',      component: 'CAQH ProView',                  role: 'Provider network directory',                     type: 'Existing System',           ibmProduct: '—' },
  { layer: 'Source',      component: 'MedImpact PBM',                 role: 'Pharmacy benefit management + PDC',              type: 'Existing System',           ibmProduct: '—' },
  { layer: 'Source',      component: 'Enterprise Content Repository', role: 'Clinical documents, discharge summaries, PDFs',  type: 'Existing System',           ibmProduct: '—' },
  { layer: 'Integration', component: 'IBM App Connect (SaaS)',        role: '100+ connectors; 5 structured source pipelines', type: 'watsonx.data Integration',  ibmProduct: '✓ IBM SaaS' },
  { layer: 'Integration', component: 'OCR + NLP Document Extractor',  role: 'Ingests PDFs, images, structured XML from docs', type: 'watsonx.data Intelligence', ibmProduct: '✓ IBM SaaS' },
  { layer: 'Storage',     component: 'Apache Iceberg (Open Format)',  role: 'Open table format — ACID, time-travel, schema evolution', type: 'watsonx.data SaaS', ibmProduct: '✓ IBM SaaS' },
  { layer: 'Storage',     component: 'IBM Cloud Object Storage',      role: 'S3-compatible blob storage for Iceberg data files', type: 'watsonx.data SaaS',      ibmProduct: '✓ IBM SaaS' },
  { layer: 'Query',       component: 'Presto (OLAP)',                  role: 'Sub-second interactive SQL over Iceberg tables', type: 'watsonx.data SaaS',        ibmProduct: '✓ IBM SaaS' },
  { layer: 'Query',       component: 'Apache Spark (ETL + ML)',        role: 'Large-scale ETL, ML pipelines, PDC calculation', type: 'watsonx.data SaaS',        ibmProduct: '✓ IBM SaaS' },
  { layer: 'Intelligence',component: 'IBM Knowledge Catalog',         role: 'Auto-profiling, metadata catalog, governance terms', type: 'watsonx.data Intelligence', ibmProduct: '✓ IBM SaaS' },
  { layer: 'Intelligence',component: 'Data Lineage Engine',           role: 'End-to-end lineage graph across all transformations', type: 'watsonx.data Intelligence', ibmProduct: '✓ IBM SaaS' },
  { layer: 'Intelligence',component: 'Policy Engine',                 role: 'HIPAA PHI masking, row-level access, NCQA rules', type: 'watsonx.data Intelligence', ibmProduct: '✓ IBM SaaS' },
  { layer: 'Intelligence',component: 'Vector Search + NLP',           role: 'Semantic search over clinical document vector store', type: 'watsonx.data Intelligence', ibmProduct: '✓ IBM SaaS' },
  { layer: 'Intelligence',component: 'Risk Scoring ML Model',         role: 'Member risk stratification (0–100 score)',       type: 'watsonx.data Intelligence', ibmProduct: '✓ IBM SaaS' },
  { layer: 'AI',          component: 'watsonx.ai Foundation Model',   role: 'LLM reasoning over structured + unstructured member data', type: 'watsonx.ai SaaS (future)', ibmProduct: '✓ IBM SaaS' },
  { layer: 'UI',          component: 'Carbon React Frontend',         role: 'Member 360 dashboard, AI assistant, exec views', type: 'Demo Application',          ibmProduct: '—' },
]

import DataTableView from '../components/DataTableView.jsx'

const COMP_HEADERS = [
  { key: 'layer',     header: 'Layer'      },
  { key: 'component', header: 'Component'  },
  { key: 'role',      header: 'Role'       },
  { key: 'type',      header: 'Product'    },
  { key: 'ibmProduct', header: 'IBM SaaS' },
]

export default function ArchitecturePage() {
  const diagramRef = useRef(null)

  useEffect(() => {
    if (!diagramRef.current) return
    // Use a timestamp-suffixed ID so React StrictMode double-invocation never
    // tries to render into a pre-existing SVG element in the DOM.
    const renderId = `arch-diagram-${Date.now()}`
    mermaid.render(renderId, DIAGRAM)
      .then(({ svg }) => {
        if (diagramRef.current) diagramRef.current.innerHTML = svg
      })
      .catch(err => {
        console.error('Mermaid render error', err)
        if (diagramRef.current) diagramRef.current.innerHTML =
          '<p style="color:#a8a8a8;text-align:center;padding:2rem">Architecture diagram unavailable. See ARCHITECTURE.md for the full diagram source.</p>'
      })
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1>Solution Architecture — watsonx.data SaaS + Integration + Intelligence</h1>
        <p>
          End-to-end lakehouse architecture for BCBS AL Member 360. Three IBM SaaS products work together:
          watsonx.data (Iceberg lakehouse + Presto/Spark query) ·
          watsonx.data Integration (App Connect pipelines) ·
          watsonx.data Intelligence (Knowledge Catalog + governance + AI enrichment).
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <Tag type="blue"   size="sm">watsonx.data SaaS</Tag>
          <Tag type="purple" size="sm">watsonx.data Integration SaaS</Tag>
          <Tag type="teal"   size="sm">watsonx.data Intelligence SaaS</Tag>
          <Tag type="gray"   size="sm">Apache Iceberg · Open Format · No Vendor Lock-in</Tag>
        </div>
      </div>

      {/* ── Mermaid Diagram ──────────────────────────────── */}
      <div className="architecture-container" aria-label="Architecture diagram">
        <div ref={diagramRef} />
      </div>

      {/* ── Product Stack Cards ──────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          {
            title: 'watsonx.data SaaS',
            subtitle: 'The Lakehouse Engine',
            color: '#0f62fe',
            points: [
              'Apache Iceberg open table format on IBM Cloud Object Storage',
              'Presto for interactive BI queries (sub-second OLAP)',
              'Apache Spark for ETL, ML, and large-scale transformations',
              'Time-travel queries — audit any historical member state',
              'Zero ETL movement — federate queries to external systems',
              'Open format — portable to any cloud, no vendor lock-in',
            ]
          },
          {
            title: 'watsonx.data Integration SaaS',
            subtitle: 'The Pipeline Engine (IBM App Connect)',
            color: '#8a3ffc',
            points: [
              '100+ pre-built connectors (TriZetto, CAQH, MedImpact, SFTP, REST)',
              'EDI 834/837, FHIR R4, NCPDP D.0 healthcare protocol support',
              'Event-driven ingestion (near real-time for care management)',
              'Batch ingestion (claims: 4-hr; pharmacy: 4-hr; enrollment: daily)',
              'Schema mapping to canonical Member 360 Iceberg model',
              'Error handling, retry logic, and pipeline observability built-in',
            ]
          },
          {
            title: 'watsonx.data Intelligence SaaS',
            subtitle: 'The Governance & AI Engine (IBM Knowledge Catalog)',
            color: '#005d5d',
            points: [
              'Auto-profiling: column stats, PII detection, quality scoring on load',
              'End-to-end lineage: source → transformation → consumption',
              'HIPAA policy enforcement: PHI masking, row-level access, audit logs',
              'NLP document processing: OCR → entity extraction → vector indexing',
              'Risk scoring ML model: 0–100 score per member, daily refresh',
              'Semantic search: natural language queries across all 10 Iceberg tables',
            ]
          }
        ].map(c => (
          <div key={c.title} style={{ padding: '1.5rem', background: '#353535', borderTop: `4px solid ${c.color}` }}>
            <h4 style={{ margin: '0 0 0.25rem', color: '#f4f4f4' }}>{c.title}</h4>
            <div style={{ fontSize: '0.8125rem', color: '#a8a8a8', marginBottom: '1rem' }}>{c.subtitle}</div>
            <ul style={{ margin: 0, padding: '0 0 0 1.25rem' }}>
              {c.points.map(p => (
                <li key={p} style={{ fontSize: '0.8125rem', color: '#c6c6c6', marginBottom: '0.375rem', lineHeight: 1.4 }}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Component Inventory ──────────────────────────── */}
      <DataTableView
        title="Component Inventory"
        description="All components in the BCBS AL Member 360 Lakehouse solution."
        headers={COMP_HEADERS}
        rows={COMPONENT_INVENTORY.map((r, i) => ({ id: String(i), ...r }))}
        statusKey="ibmProduct"
        pageSize={20}
        showExport
      />
    </div>
  )
}
