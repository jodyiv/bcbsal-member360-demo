import api from './api.js'
import { WATSONX_MOCK_RESPONSES } from '../data/mockResponses/watsonxMocks.js'

const MOCK_LATENCY = () => 900 + Math.random() * 700  // 900–1600 ms

export async function askMember360Question({ question, memberId, mode = 'mock' }) {
  if (mode === 'live') {
    return api.post('/ai/ask', { question, member_id: memberId })
  }
  // Mock: simulate latency then return canned response
  await new Promise(r => setTimeout(r, MOCK_LATENCY()))
  const key = Object.keys(WATSONX_MOCK_RESPONSES).find(k =>
    question.toLowerCase().includes(k.toLowerCase())
  ) || 'default'
  return WATSONX_MOCK_RESPONSES[key] || WATSONX_MOCK_RESPONSES.default
}

export async function listModels(mode = 'mock') {
  if (mode === 'live') return api.get('/ai/models')
  return [
    { id: 'meta-llama/llama-4-maverick-17b-128e-instruct-fp8', label: 'Llama 4 Maverick (Default · Multimodal)', default: true },
    { id: 'ibm/granite-3-3-8b-instruct', label: 'IBM Granite 3.3 8B Instruct' }
  ]
}
