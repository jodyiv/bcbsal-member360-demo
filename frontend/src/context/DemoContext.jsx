import React, { createContext, useContext, useReducer } from 'react'

const DemoContext = createContext(null)

const initialState = {
  demoMode: import.meta.env.VITE_DEMO_MODE || 'mock',
  demoTitle: import.meta.env.VITE_DEMO_TITLE || 'BCBS AL Member 360 Lakehouse',
  clientCode: import.meta.env.VITE_DEMO_CLIENT_CODE || 'DEMO-BCBSAL-001',
  selectedMember: null,
  aiResponses: {},
  isLoading: false,
  notifications: [],
  activeScenario: null,
  ingestionStatus: {
    enrollment: 'completed',
    claims: 'completed',
    provider: 'completed',
    care: 'completed',
    pharmacy: 'completed',
    documents: 'processing'
  },
  // watsonx.data SaaS service status
  serviceStatus: {
    lakehouse:    { name: 'watsonx.data (SaaS)',            status: 'connected', color: '#24a148' },
    integration:  { name: 'watsonx.data Integration (SaaS)', status: 'connected', color: '#24a148' },
    intelligence: { name: 'watsonx.data Intelligence (SaaS)', status: 'connected', color: '#24a148' },
  }
}

function demoReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_DEMO_MODE':
      return { ...state, demoMode: action.payload }
    case 'SET_SELECTED_MEMBER':
      return { ...state, selectedMember: action.payload }
    case 'SET_AI_RESPONSE':
      return { ...state, aiResponses: { ...state.aiResponses, [action.key]: action.payload } }
    case 'CLEAR_AI_RESPONSE':
      return { ...state, aiResponses: { ...state.aiResponses, [action.key]: null } }
    case 'SET_ACTIVE_SCENARIO':
      return { ...state, activeScenario: action.payload }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, { id: Date.now(), ...action.payload }] }
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.id) }
    case 'SET_INGESTION_STATUS':
      return { ...state, ingestionStatus: { ...state.ingestionStatus, ...action.payload } }
    case 'RESET_DEMO':
      return { ...initialState, demoMode: state.demoMode }
    default:
      return state
  }
}

export function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(demoReducer, initialState)
  return (
    <DemoContext.Provider value={{ state, dispatch }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemoContext() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemoContext must be used within DemoProvider')
  return ctx
}
