import api from './api.js'
import { DASHBOARD_MOCK } from '../data/mockResponses/dashboardMocks.js'
import { MEMBER_360_MOCK } from '../data/mockResponses/member360Mocks.js'

export async function fetchDashboardData(mode = 'mock') {
  if (mode === 'live') {
    try { return await api.get('/data/dashboard') }
    catch { console.warn('[dataService] live dashboard failed, using mock'); return DASHBOARD_MOCK }
  }
  await new Promise(r => setTimeout(r, 300))
  return DASHBOARD_MOCK
}

export async function fetchMember360(memberId = 'MBR-JS-0042', mode = 'mock') {
  if (mode === 'live') {
    try { return await api.get(`/data/member/${memberId}`) }
    catch { return MEMBER_360_MOCK }
  }
  await new Promise(r => setTimeout(r, 250))
  return MEMBER_360_MOCK
}

export async function fetchIngestionStatus(mode = 'mock') {
  if (mode === 'live') {
    try { return await api.get('/data/ingestion-status') }
    catch { return null }
  }
  return null
}

export async function fetchGovernanceLineage(mode = 'mock') {
  if (mode === 'live') {
    try { return await api.get('/data/lineage') }
    catch { return null }
  }
  return null
}
