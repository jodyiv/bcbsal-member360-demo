import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Theme } from '@carbon/react'
import App from './App.jsx'
import { DemoProvider } from './context/DemoContext.jsx'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Theme theme="g90">
        <DemoProvider>
          <App />
        </DemoProvider>
      </Theme>
    </BrowserRouter>
  </React.StrictMode>
)
