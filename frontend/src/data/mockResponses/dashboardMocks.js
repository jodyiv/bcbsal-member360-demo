/**
 * Dashboard KPIs and chart data — watsonx.data Iceberg lakehouse (SaaS)
 * Synthetic data only — no real member PII
 */

// Generate 90-day cost trend (monthly buckets Apr–Jun for illustration)
function days90CostTrend() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
  const claimsBase   = [4.1, 4.4, 5.1, 4.8, 5.3, 5.9, 6.2, 6.8, 7.1, 7.4, 7.8]
  const pharmacyBase = [1.1, 1.2, 1.2, 1.3, 1.3, 1.4, 1.4, 1.5, 1.5, 1.6, 1.7]
  const data = []
  months.forEach((m, i) => {
    data.push({ group: 'Medical Claims', key: m, value: claimsBase[i] })
    data.push({ group: 'Pharmacy',       key: m, value: pharmacyBase[i] })
  })
  return data
}

function riskDistribution() {
  return [
    { group: 'High Risk (Score ≥80)',   value: 3847  },
    { group: 'Rising Risk (60–79)',     value: 12104 },
    { group: 'Moderate (40–59)',        value: 28950 },
    { group: 'Low Risk (<40)',          value: 87099 },
  ]
}

function careGapsByCondition() {
  const conditions = ['Diabetes (CDC)', 'Cardiovascular (SPC)', 'COPD (SPD)', 'Hypertension (CBP)', 'Cancer Screening', 'Mental Health (AMM)']
  const open   = [12847, 9412, 4231, 18904, 7650, 3210]
  const closed = [34100, 28760, 8940, 31200, 19400, 7890]
  const data = []
  conditions.forEach((c, i) => {
    data.push({ group: 'Open Gap',   key: c, value: open[i]   })
    data.push({ group: 'Gap Closed', key: c, value: closed[i] })
  })
  return data
}

export const DASHBOARD_MOCK = {
  kpis: [
    { id: 'members',      label: 'Total Members',             value: '132,000', unit: '',    trend: 2.1,  trendLabel: 'YoY growth',     variant: 'info'    },
    { id: 'high_risk',    label: 'High-Risk Members',         value: '3,847',   unit: '',    trend: -8.3, trendLabel: 'vs prior year',  variant: 'danger'  },
    { id: 'cost_pmpm',    label: 'Avg Cost PMPM',             value: '$892',    unit: '',    trend: 3.7,  trendLabel: 'trending up',    variant: 'warning' },
    { id: 'care_gaps',    label: 'Open HEDIS Care Gaps',      value: '56,254',  unit: '',    trend: -12.4,trendLabel: 'closed this yr', variant: 'success' },
    { id: 'readmissions', label: '30-Day Readmission Rate',   value: '8.2',     unit: '%',   trend: -1.9, trendLabel: 'vs 10.1% baseline', variant: 'success' },
    { id: 'ai_score',     label: 'AI Readiness Score',        value: '74',      unit: '/100',trend: 18,   trendLabel: 'since lakehouse go-live', variant: 'purple' },
  ],

  costTrendChart: {
    data: days90CostTrend(),
    options: {
      title: 'Paid Claims + Pharmacy Cost Trend ($M) — Rolling 11 Months',
      axes: {
        left:   { mapsTo: 'value', title: 'Cost ($M)', scaleType: 'linear' },
        bottom: { mapsTo: 'key',   title: 'Month',     scaleType: 'labels' }
      },
      color: { scale: { 'Medical Claims': '#0f62fe', 'Pharmacy': '#8a3ffc' } },
      curve: 'curveMonotoneX',
      theme: 'g90',
      height: '320px'
    }
  },

  riskDistChart: {
    data: riskDistribution(),
    options: {
      title: 'Member Risk Stratification',
      resizable: true,
      donut: { center: { label: '132K Members' } },
      legend: { position: 'right', truncation: { type: 'none' } },
      color: { scale: {
        'High Risk (Score ≥80)':  '#da1e28',
        'Rising Risk (60–79)':    '#f1c21b',
        'Moderate (40–59)':       '#4589ff',
        'Low Risk (<40)':         '#24a148'
      }},
      theme: 'g90',
      height: '320px'
    }
  },

  careGapChart: {
    data: careGapsByCondition(),
    options: {
      title: 'HEDIS Care Gaps by Measure — Open vs. Closed',
      axes: {
        left:   { mapsTo: 'value', title: 'Members', scaleType: 'linear' },
        bottom: { mapsTo: 'key',   title: 'HEDIS Measure', scaleType: 'labels' }
      },
      color: { scale: { 'Open Gap': '#da1e28', 'Gap Closed': '#24a148' } },
      theme: 'g90',
      height: '320px'
    }
  },

  // High-risk member alerts table
  alerts: [
    { id: 'a01', member: 'Jane Smith',       id_num: 'MBR-JS-0042', condition: 'CHF + DM + CKD',   risk: 87, action: 'Adherence Gap',           status: 'open'       },
    { id: 'a02', member: 'Robert Henderson', id_num: 'MBR-RH-0187', condition: 'COPD + CAD',       risk: 82, action: 'Missing Specialist Visit', status: 'inprogress' },
    { id: 'a03', member: 'Maria Gonzalez',   id_num: 'MBR-MG-0319', condition: 'DM + Depression',  risk: 79, action: 'HbA1c Gap',               status: 'open'       },
    { id: 'a04', member: 'James Whitfield',  id_num: 'MBR-JW-0451', condition: 'CHF + A-Fib',      risk: 76, action: 'Transitions of Care',     status: 'inprogress' },
    { id: 'a05', member: 'Dorothy Simmons',  id_num: 'MBR-DS-0502', condition: 'CKD + HTN',        risk: 74, action: 'Nephrology Referral',     status: 'open'       },
    { id: 'a06', member: 'William Carter',   id_num: 'MBR-WC-0615', condition: 'Cancer + Anxiety', risk: 71, action: 'Behavioral Health',       status: 'pending'    },
    { id: 'a07', member: 'Evelyn Brooks',    id_num: 'MBR-EB-0730', condition: 'DM + Obesity',     risk: 68, action: 'DSME Enrollment',         status: 'open'       },
    { id: 'a08', member: 'Harold Johnson',   id_num: 'MBR-HJ-0844', condition: 'CAD Post-CABG',    risk: 66, action: 'Cardiac Rehab Gap',      status: 'completed'  },
  ],

  // Ingestion pipeline summary
  ingestionSummary: [
    { source: 'Member Enrollment',    system: 'Enrollware',        records: '132,000', latency: '< 1 hr',  status: 'completed', format: 'Iceberg'   },
    { source: 'Medical Claims',       system: 'TriZetto QNXT',     records: '4.8M',    latency: '4 hrs',   status: 'completed', format: 'Iceberg'   },
    { source: 'Provider Network',     system: 'CAQH ProView',      records: '28,400',  latency: '< 1 hr',  status: 'completed', format: 'Iceberg'   },
    { source: 'Care Management',      system: 'CareEdge',          records: '18,200',  latency: '2 hrs',   status: 'completed', format: 'Iceberg'   },
    { source: 'Pharmacy Claims',      system: 'MedImpact',         records: '2.1M',    latency: '3 hrs',   status: 'completed', format: 'Iceberg'   },
    { source: 'Clinical Documents',   system: 'Content Repository',records: '94,000',  latency: '6 hrs',   status: 'processing',format: 'Vector'    },
  ],

  // Executive time-to-value
  timeToValue: [
    { milestone: 'Pilot kick-off',           week: 0,  status: 'completed' },
    { milestone: 'watsonx.data provisioning',week: 1,  status: 'completed' },
    { milestone: 'First 3 source connections',week: 2, status: 'completed' },
    { milestone: 'All 6 sources ingested',   week: 4,  status: 'completed' },
    { milestone: 'Intelligence catalog live',week: 5,  status: 'completed' },
    { milestone: 'Member 360 dashboard',     week: 6,  status: 'completed' },
    { milestone: 'AI assistant launch',      week: 8,  status: 'inprogress' },
    { milestone: 'HEDIS gap automation',     week: 12, status: 'pending'   },
  ]
}
