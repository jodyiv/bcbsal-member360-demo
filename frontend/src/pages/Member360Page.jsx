import React, { useEffect, useState } from 'react'
import {
  Tag, Button, TextArea, Loading, Select, SelectItem
} from '@carbon/react'
import {
  WatsonHealthAiResults, Document, Warning, Checkmark,
  Medication, UserFollow, Activity, ChartLine
} from '@carbon/icons-react'
import { LineChart } from '@carbon/charts-react'
import { useDemoContext } from '../context/DemoContext.jsx'
import { fetchMember360 } from '../services/dataService.js'
import { askMember360Question } from '../services/watsonxService.js'
import AIResponsePanel from '../components/AIResponsePanel.jsx'
import { fmt, adherenceClass } from '../utils/formatters.js'

const PRESET_QUESTIONS = [
  { label: 'Show everything about Jane Smith',       q: 'Show everything about Jane Smith' },
  { label: 'What drives her risk score?',            q: 'What drives her risk score?' },
  { label: 'Summarize recent hospital activity',     q: 'Summarize recent hospital activity' },
  { label: 'Are there care gaps?',                   q: 'Are there care gaps?' },
  { label: 'What interventions should be prioritized?', q: 'What interventions should be prioritized?' },
]

export default function Member360Page() {
  const { state, dispatch } = useDemoContext()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [question, setQuestion] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)
  const [selectedDoc, setSelectedDoc] = useState(null)

  useEffect(() => {
    fetchMember360('MBR-JS-0042', state.demoMode)
      .then(d => setMember(d))
      .finally(() => setLoading(false))
  }, [state.demoMode])

  const handleAsk = async (q = question) => {
    if (!q.trim()) return
    setAiLoading(true)
    setAiResponse(null)
    try {
      const resp = await askMember360Question({ question: q, memberId: 'MBR-JS-0042', mode: state.demoMode })
      setAiResponse(resp)
    } catch (e) {
      console.error(e)
    } finally {
      setAiLoading(false)
    }
  }

  if (loading) return (
    <div className="loading-indicator">
      <Loading description="Loading Member 360…" withOverlay={false} />
      <span>Querying watsonx.data Iceberg lakehouse for MBR-JS-0042…</span>
    </div>
  )

  const { member: mbr, conditions, recentClaims, medications, careInterventions, careGaps, documents, providers, costTrend } = member

  return (
    <div>
      <div className="page-header">
        <h1>Member 360 — watsonx.data Iceberg Lakehouse</h1>
        <p>
          Unified member view assembled in real-time by Presto SQL across 5 structured Iceberg tables
          + unstructured documents vectorized by <strong>watsonx.data Intelligence SaaS</strong>.
          Start with the AI assistant below to answer: <em>"Why is Jane Smith high risk?"</em>
        </p>
      </div>

      {/* ── Member Profile Header ─────────────────────────── */}
      <div className="member-profile-header">
        <div className="member-avatar" aria-label="Member initials">{mbr.initials}</div>
        <div style={{ flex: 1 }}>
          <h2 className="member-name">{mbr.name}</h2>
          <div className="member-meta">
            <span>ID: {mbr.id}</span>
            <span>Age {mbr.age} · {mbr.gender}</span>
            <span>{mbr.planType}</span>
            <span>PCP: {mbr.pcpName}</span>
            <span>Care Manager: {mbr.careManager}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {conditions.map(c => (
              <Tag key={c.icd10} type={c.severity === 'Severe' ? 'red' : c.severity === 'Moderate' ? 'magenta' : 'teal'} size="sm">
                {c.icd10} {c.name}
              </Tag>
            ))}
          </div>
        </div>
        <div className="risk-badge" aria-label={`Risk score ${mbr.riskScore} out of 100, tier ${mbr.riskTier}`}>
          <div className="risk-score">{mbr.riskScore}</div>
          <div className="risk-label">Risk Score</div>
          <Tag type="red" size="sm" style={{ marginTop: '0.25rem' }}>{mbr.riskTier} Risk</Tag>
        </div>
      </div>

      {/* ── AI Assistant ──────────────────────────────────── */}
      <div className="ai-panel" role="region" aria-label="AI Member 360 Assistant">
        <div className="ai-panel-header">
          <WatsonHealthAiResults size={20} aria-hidden="true" />
          <h3>Member 360 AI Assistant</h3>
          <span className="ai-badge">watsonx.data Intelligence SaaS</span>
          <Tag type="gray" size="sm" style={{ marginLeft: 'auto' }}>Structured + Unstructured</Tag>
        </div>

        <div className="preset-questions">
          {PRESET_QUESTIONS.map(pq => (
            <Button
              key={pq.label}
              kind="tertiary"
              size="sm"
              onClick={() => { setQuestion(pq.q); handleAsk(pq.q) }}
              aria-label={`Ask: ${pq.q}`}
            >
              {pq.label}
            </Button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <TextArea
            id="ai-question"
            labelText="Ask a question about this member"
            placeholder='e.g. "What medications have adherence gaps?" or "When was the last hospital admission?"'
            value={question}
            onChange={e => setQuestion(e.target.value)}
            rows={2}
            style={{ flex: 1 }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk() } }}
          />
          <Button
            kind="primary"
            renderIcon={WatsonHealthAiResults}
            onClick={() => handleAsk()}
            disabled={aiLoading || !question.trim()}
            aria-label="Submit question to watsonx.data Intelligence"
          >
            Ask AI
          </Button>
        </div>

        <AIResponsePanel
          response={aiResponse}
          isLoading={aiLoading}
          onRegenerate={() => handleAsk()}
        />
      </div>

      {/* ── Member 360 Data Grid ───────────────────────────── */}
      <div className="member-360-grid">
        {/* Medications + Adherence */}
        <div className="data-section">
          <h4><Medication size={16} /> Pharmacy — PDC Adherence (MedImpact via watsonx.data)</h4>
          {medications.map(m => {
            const cls = adherenceClass(m.pdc)
            return (
              <div key={m.drug} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#f4f4f4', fontWeight: 500 }}>{m.drug}</span>
                  <Tag
                    type={m.pdc < 65 ? 'red' : m.pdc < 80 ? 'magenta' : 'green'}
                    size="sm"
                  >
                    {m.status}
                  </Tag>
                </div>
                <div className="adherence-bar">
                  <span className="bar-drug text-muted">{m.indication}</span>
                  <div className="bar-track">
                    <div
                      className={`bar-fill bar-fill--${cls}`}
                      style={{ width: `${m.pdc}%` }}
                      role="progressbar"
                      aria-valuenow={m.pdc}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${m.drug} PDC: ${m.pdc}%`}
                    />
                  </div>
                  <span className="bar-pct">{m.pdc}%</span>
                </div>
              </div>
            )
          })}
          <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#262626', fontSize: '0.75rem', color: '#a8a8a8' }}>
            PDC threshold for HEDIS compliance = 80% · 2 drugs below threshold
          </div>
        </div>

        {/* Care Gaps */}
        <div className="data-section">
          <h4><Checkmark size={16} /> HEDIS Care Gaps — watsonx.data Intelligence</h4>
          {careGaps.map(g => (
            <div key={g.measure} style={{ paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid #393939' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#f4f4f4' }}>{g.measure}</span>
                <Tag
                  type={g.status === 'open' ? (g.hedisImpact === 'HIGH' ? 'red' : 'magenta') : 'green'}
                  size="sm"
                  style={{ flexShrink: 0 }}
                >
                  {g.status === 'open' ? `OPEN · ${g.hedisImpact}` : 'Closed'}
                </Tag>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6f6f6f', marginTop: '0.25rem' }}>
                Last completed: {g.lastCompleted} · Due: {g.dueDate}
              </div>
            </div>
          ))}
        </div>

        {/* Care Management */}
        <div className="data-section">
          <h4><UserFollow size={16} /> Care Management — CareEdge via watsonx.data</h4>
          {careInterventions.map(ci => (
            <div key={ci.id} style={{ paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid #393939' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#f4f4f4', fontWeight: 500 }}>{ci.program}</span>
                <Tag
                  type={ci.status === 'open' ? 'red' : ci.status === 'inprogress' ? 'blue' : 'green'}
                  size="sm"
                  style={{ flexShrink: 0 }}
                >
                  {ci.status === 'inprogress' ? 'In Progress' : ci.status.charAt(0).toUpperCase() + ci.status.slice(1)}
                </Tag>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6f6f6f', marginTop: '0.25rem' }}>
                Touchpoints: {ci.touchpoints} · Due: {ci.due}
              </div>
            </div>
          ))}
        </div>

        {/* Providers */}
        <div className="data-section">
          <h4><UserFollow size={16} /> Provider Network — CAQH via watsonx.data</h4>
          {providers.map(p => (
            <div key={p.role} style={{ paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid #393939' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.875rem', color: '#f4f4f4', fontWeight: 500 }}>{p.name}</span>
                <Tag type={p.network === 'In-Network' ? 'green' : 'red'} size="sm">{p.network}</Tag>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#a8a8a8', marginTop: '0.25rem' }}>
                {p.role} · {p.specialty}
              </div>
              <div style={{ fontSize: '0.75rem', color: p.nextVisit.includes('OVERDUE') ? '#fa4d56' : '#6f6f6f', marginTop: '0.125rem' }}>
                Last: {p.lastVisit} · Next: {p.nextVisit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cost Trend ────────────────────────────────────────── */}
      <div className="chart-tile section-spacer">
        <h5><ChartLine size={14} style={{ marginRight: 6 }} /> Annual Cost Trend — Presto SQL on Iceberg Claims Table</h5>
        <LineChart data={costTrend.data} options={costTrend.options} />
      </div>

      {/* ── Clinical Documents ─────────────────────────────── */}
      <div className="data-section section-spacer">
        <h4>
          <Document size={16} /> Clinical Documents — Indexed by watsonx.data Intelligence SaaS
          <Tag type="purple" size="sm" style={{ marginLeft: '0.5rem' }}>NLP Vectorized</Tag>
        </h4>
        <p style={{ fontSize: '0.8125rem', color: '#a8a8a8', margin: '0 0 1rem' }}>
          Unstructured documents (discharge summaries, referrals, prior auths, nurse notes)
          are ingested, OCR-processed, NLP-enriched, and vectorized by watsonx.data Intelligence.
          The AI assistant above queries this vector store alongside structured Iceberg tables.
        </p>
        <div className="document-grid">
          {documents.map(doc => (
            <div
              key={doc.id}
              className={`document-card${selectedDoc?.id === doc.id ? ' document-card--selected' : ''}`}
              onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
              role="button"
              tabIndex={0}
              aria-pressed={selectedDoc?.id === doc.id}
              aria-label={`Select document: ${doc.title}`}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedDoc(selectedDoc?.id === doc.id ? null : doc) } }}
            >
              <div className="doc-type">
                <Tag type={doc.type === 'Discharge Summary' ? 'red' : doc.type === 'Prior Authorization' ? 'blue' : doc.type === 'Nurse Notes' ? 'teal' : doc.type === 'Clinical Note' ? 'purple' : 'gray'} size="sm">
                  {doc.type}
                </Tag>
              </div>
              <div className="doc-title">{doc.title}</div>
              <div className="doc-meta">{doc.date} · {doc.author}</div>
              <div className="doc-excerpt">{doc.excerpt}</div>
              {doc.indexed && (
                <div style={{ marginTop: '0.5rem' }}>
                  <Tag type="green" size="sm">✓ Indexed · {doc.indexedBy}</Tag>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Expanded document view */}
        {selectedDoc && (
          <div style={{ padding: '1.25rem', background: '#262626', border: '1px solid #0f62fe', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <Tag type="blue" size="sm">{selectedDoc.type}</Tag>
                <h4 style={{ margin: '0.5rem 0 0.25rem', color: '#f4f4f4' }}>{selectedDoc.title}</h4>
                <div style={{ fontSize: '0.8125rem', color: '#a8a8a8' }}>{selectedDoc.date} · {selectedDoc.author}</div>
              </div>
              <Button kind="ghost" size="sm" onClick={() => setSelectedDoc(null)} aria-label="Close document">✕</Button>
            </div>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: '#f4f4f4', whiteSpace: 'pre-wrap' }}>
              {selectedDoc.excerpt}
            </p>
            <div style={{ marginTop: '0.75rem' }}>
              <Tag type="green" size="sm">✓ Vectorized — queryable by AI assistant</Tag>
              <Tag type="purple" size="sm" style={{ marginLeft: '0.5rem' }}>watsonx.data Intelligence</Tag>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
