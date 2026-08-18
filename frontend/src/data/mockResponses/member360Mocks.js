/**
 * Member 360 synthetic record — Jane Smith
 * All data synthetic — no real PII
 * Sources federated via watsonx.data Integration SaaS into Iceberg lakehouse
 */
export const MEMBER_360_MOCK = {
  // ── Demographics & Coverage (Enrollment System via watsonx.data Integration) ──
  member: {
    id: 'MBR-JS-0042',
    name: 'Jane Smith',
    initials: 'JS',
    dob: '1967-03-14',
    age: 58,
    gender: 'Female',
    address: 'Birmingham, AL 35203',
    phone: '(205) 555-0182',
    email: 'jsmith.member@example.com',
    planType: 'Individual + Spouse — PPO Plus',
    planId: 'PPO-PLUS-AL-GRP',
    effectiveDate: '2019-01-01',
    groupName: 'Smith Consulting LLC',
    riskScore: 87,
    riskTier: 'High',
    pcpName: 'Dr. Raymond Castillo, MD',
    pcpSpecialty: 'Internal Medicine / Cardiology',
    pcpPhone: '(205) 555-0340',
    careManager: 'Sarah Okonkwo, RN, CCM',
    careManagerPhone: '(205) 555-0201'
  },

  // ── Chronic Conditions (Claims DX codes + Clinical NLP via watsonx.data Intelligence) ──
  conditions: [
    { icd10: 'I50.9', name: 'Congestive Heart Failure',          onset: '2022-06', severity: 'Severe',   status: 'active' },
    { icd10: 'E11.9', name: 'Type 2 Diabetes Mellitus',          onset: '2017-03', severity: 'Moderate', status: 'active' },
    { icd10: 'N18.3', name: 'Chronic Kidney Disease Stage 3',    onset: '2021-11', severity: 'Moderate', status: 'active' },
    { icd10: 'I10',   name: 'Essential Hypertension',            onset: '2015-07', severity: 'Mild',     status: 'active' },
    { icd10: 'E78.5', name: 'Hyperlipidemia',                    onset: '2016-02', severity: 'Mild',     status: 'active' },
  ],

  // ── Claims History (TriZetto QNXT via watsonx.data Integration → Iceberg) ──
  recentClaims: [
    { id: 'CLM-0042-001', date: '2025-11-03', type: 'ED',        facility: 'Grandview Medical Ctr',  dx: 'Chest Pain / Dyspnea',      allowed: 3240,  status: 'completed' },
    { id: 'CLM-0042-002', date: '2025-10-15', type: 'Office',    facility: 'Castillo Internal Med',  dx: 'CHF Follow-up',             allowed: 340,   status: 'completed' },
    { id: 'CLM-0042-003', date: '2025-09-28', type: 'Lab',       facility: 'LabCorp',                dx: 'Comprehensive Metabolic',   allowed: 185,   status: 'completed' },
    { id: 'CLM-0042-004', date: '2025-08-07', type: 'Inpatient', facility: 'UAB Hospital',           dx: 'Acute Kidney Injury',       allowed: 12800, status: 'completed' },
    { id: 'CLM-0042-005', date: '2025-07-22', type: 'Office',    facility: 'UAB Cardiology',         dx: 'CHF Management',            allowed: 420,   status: 'completed' },
    { id: 'CLM-0042-006', date: '2025-06-11', type: 'Imaging',   facility: 'Grandview Radiology',    dx: 'Echocardiogram',            allowed: 1840,  status: 'completed' },
    { id: 'CLM-0042-007', date: '2025-05-03', type: 'Office',    facility: 'Castillo Internal Med',  dx: 'DM + CKD Management',      allowed: 380,   status: 'completed' },
    { id: 'CLM-0042-008', date: '2025-04-14', type: 'Lab',       facility: 'Quest Diagnostics',      dx: 'HbA1c + Lipid Panel',       allowed: 220,   status: 'completed' },
    { id: 'CLM-0042-009', date: '2025-03-14', type: 'Inpatient', facility: 'Grandview Medical Ctr',  dx: 'CHF Exacerbation',          allowed: 21400, status: 'completed' },
    { id: 'CLM-0042-010', date: '2025-02-08', type: 'Office',    facility: 'Castillo Internal Med',  dx: 'Annual Wellness',           allowed: 290,   status: 'completed' },
  ],

  // ── Cost Trend (Iceberg table via Presto SQL aggregate) ──
  costTrend: {
    data: [
      { group: 'Allowed Cost', key: '2022', value: 28400 },
      { group: 'Allowed Cost', key: '2023', value: 47800 },
      { group: 'Allowed Cost', key: '2024', value: 62100 },
      { group: 'Allowed Cost', key: '2025 (YTD)', value: 78450 },
    ],
    options: {
      title: 'Jane Smith — Annual Allowed Cost Trend',
      axes: {
        left:   { mapsTo: 'value', title: 'Allowed ($)', scaleType: 'linear' },
        bottom: { mapsTo: 'key',   title: 'Year',        scaleType: 'labels' }
      },
      color: { scale: { 'Allowed Cost': '#fa4d56' } },
      theme: 'g90',
      height: '260px'
    }
  },

  // ── Providers (CAQH ProView via watsonx.data Integration) ──
  providers: [
    { role: 'PCP',              name: 'Dr. Raymond Castillo, MD',     specialty: 'Internal Medicine',  network: 'In-Network', lastVisit: '2025-10-15', nextVisit: '2025-12-12' },
    { role: 'Cardiologist',     name: 'Dr. Angela Merritt, MD',       specialty: 'Cardiology',         network: 'In-Network', lastVisit: '2025-07-22', nextVisit: 'Not Scheduled' },
    { role: 'Nephrologist',     name: 'Dr. Patricia Nguyen, MD',      specialty: 'Nephrology',         network: 'In-Network', lastVisit: 'Not Yet Seen', nextVisit: 'OVERDUE (referral Aug 2025)' },
    { role: 'Endocrinologist',  name: 'Referral Pending',             specialty: 'Endocrinology',      network: 'In-Network', lastVisit: '—',          nextVisit: 'Pending scheduling' },
  ],

  // ── Pharmacy / Medication Adherence (MedImpact via watsonx.data Integration) ──
  medications: [
    { drug: 'Empagliflozin 10mg',  class: 'SGLT-2 Inhibitor',    indication: 'DM + CHF + CKD', pdc: 52, lastFill: '2025-09-14', status: 'Gap — CRITICAL' },
    { drug: 'Carvedilol 25mg',     class: 'Beta-Blocker',         indication: 'CHF',            pdc: 61, lastFill: '2025-10-02', status: 'Gap — CRITICAL' },
    { drug: 'Lisinopril 10mg',     class: 'ACE Inhibitor',        indication: 'HTN + CKD',      pdc: 88, lastFill: '2025-10-28', status: 'Adherent'       },
    { drug: 'Furosemide 40mg',     class: 'Loop Diuretic',        indication: 'CHF — Edema',    pdc: 84, lastFill: '2025-10-20', status: 'Adherent'       },
    { drug: 'Atorvastatin 40mg',   class: 'Statin',               indication: 'Hyperlipidemia', pdc: 88, lastFill: '2025-10-25', status: 'Adherent'       },
    { drug: 'Metformin 1000mg',    class: 'Biguanide',            indication: 'DM',             pdc: 82, lastFill: '2025-11-01', status: 'Adherent'       },
  ],

  // ── Care Management (CareEdge via watsonx.data Integration) ──
  careInterventions: [
    { id: 'CM-001', program: 'CHF Transitions of Care',         enrolled: '2025-10-05', due: '2025-12-31', touchpoints: '2 of 6', status: 'inprogress' },
    { id: 'CM-002', program: 'Diabetes Education (DSME)',       enrolled: '2025-07-12', due: '2025-11-30', touchpoints: '0 of 4', status: 'open'       },
    { id: 'CM-003', program: 'Nephrology Referral Follow-Up',   enrolled: '2025-08-10', due: '2025-09-10', touchpoints: '0 of 1', status: 'open'       },
    { id: 'CM-004', program: 'Annual Wellness Outreach',        enrolled: '2025-02-08', due: '2025-12-31', touchpoints: '1 of 1', status: 'completed'  },
  ],

  // ── HEDIS Care Gaps ──
  careGaps: [
    { measure: 'Comprehensive Diabetes Care (CDC) — HbA1c',     dueDate: '2025-12-31', lastCompleted: '2025-06-04', status: 'open',      hedisImpact: 'HIGH'   },
    { measure: 'Statin Use in CVD (SPC) — LDL Test',            dueDate: '2025-12-31', lastCompleted: 'Never (in year)', status: 'open', hedisImpact: 'HIGH'   },
    { measure: 'Diabetic Eye Exam (CDC sub-measure)',            dueDate: '2025-12-31', lastCompleted: '2023-09-01', status: 'open',      hedisImpact: 'MEDIUM' },
    { measure: 'Nephropathy Monitoring (CDC) — uACR',           dueDate: '2025-12-31', lastCompleted: '2025-08-08', status: 'closed',    hedisImpact: 'LOW'    },
    { measure: 'Blood Pressure Control (CBP)',                   dueDate: '2025-12-31', lastCompleted: '2025-11-03', status: 'closed',    hedisImpact: 'MEDIUM' },
  ],

  // ── Unstructured Documents (Content Repository → watsonx.data Intelligence → vectorized) ──
  documents: [
    {
      id: 'DOC-001',
      type: 'Discharge Summary',
      title: 'Grandview MC — CHF Exacerbation Discharge',
      date: '2025-03-18',
      author: 'Dr. Angela Merritt, MD',
      excerpt: 'Patient discharged after 4-day admission for decompensated CHF. BNP normalized to 620. EF 38%. Medication reconciliation completed. Follow-up with cardiology in 7 days.',
      indexed: true,
      indexedBy: 'watsonx.data Intelligence'
    },
    {
      id: 'DOC-002',
      type: 'Discharge Summary',
      title: 'UAB Hospital — Acute Kidney Injury Discharge',
      date: '2025-08-09',
      author: 'Dr. Patricia Nguyen, MD',
      excerpt: 'AKI in setting of volume depletion. Creatinine peaked 2.8, discharged 1.9. Nephrology referral placed. Follow-up in 30 days.',
      indexed: true,
      indexedBy: 'watsonx.data Intelligence'
    },
    {
      id: 'DOC-003',
      type: 'Prior Authorization',
      title: 'Empagliflozin Prior Auth — Approved',
      date: '2024-11-20',
      author: 'BCBS AL Utilization Management',
      excerpt: 'Prior authorization approved for Empagliflozin 10mg QD for HFrEF + CKD Stage 3. Valid through 11/30/2025.',
      indexed: true,
      indexedBy: 'watsonx.data Intelligence'
    },
    {
      id: 'DOC-004',
      type: 'Referral Document',
      title: 'Nephrology Referral — Dr. Patricia Nguyen',
      date: '2025-08-10',
      author: 'Dr. Raymond Castillo, MD',
      excerpt: 'Referral for nephrology evaluation following AKI. CKD Stage 3 with eGFR 44. Urgent — appointment to be scheduled within 30 days.',
      indexed: true,
      indexedBy: 'watsonx.data Intelligence'
    },
    {
      id: 'DOC-005',
      type: 'Nurse Notes',
      title: 'Care Manager Call Notes',
      date: '2025-10-22',
      author: 'Sarah Okonkwo, RN, CCM',
      excerpt: 'Spoke with member. Transportation barrier noted — difficulty getting to appointments. Empagliflozin cost concern expressed. Will follow up with medication assistance program info.',
      indexed: true,
      indexedBy: 'watsonx.data Intelligence'
    },
    {
      id: 'DOC-006',
      type: 'Case Management Notes',
      title: 'CHF Transitions of Care — Session 2',
      date: '2025-11-08',
      author: 'Sarah Okonkwo, RN, CCM',
      excerpt: 'Second touchpoint completed. Member reports weighing daily. Instructed to call if weight gain >2 lbs in a day. Diabetes education referral re-discussed — member interested in telehealth option.',
      indexed: true,
      indexedBy: 'watsonx.data Intelligence'
    },
    {
      id: 'DOC-007',
      type: 'Clinical Note',
      title: 'Cardiology Office Note — CHF Follow-Up',
      date: '2025-07-22',
      author: 'Dr. Angela Merritt, MD',
      excerpt: 'Stable compensated CHF. EF 38% per June echo. BP 142/88. Carvedilol dose maintained. Consider Empagliflozin adherence support — patient reports sometimes skipping due to cost.',
      indexed: true,
      indexedBy: 'watsonx.data Intelligence'
    },
    {
      id: 'DOC-008',
      type: 'Lab Report',
      title: 'Comprehensive Metabolic Panel + HbA1c',
      date: '2025-06-04',
      author: 'Quest Diagnostics',
      excerpt: 'HbA1c: 8.4% (above 9.0% = poor control threshold). eGFR: 44 mL/min/1.73m² (down from 52 in Jan 2025). Creatinine: 1.6. BUN: 28.',
      indexed: true,
      indexedBy: 'watsonx.data Intelligence'
    },
  ]
}
