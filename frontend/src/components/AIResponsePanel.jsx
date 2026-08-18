import React, { useState } from 'react'
import { Tag, Button, Loading } from '@carbon/react'
import { Copy, Renew, Information } from '@carbon/icons-react'

/**
 * AIResponsePanel — renders a watsonx.ai generated response with metadata
 */
export default function AIResponsePanel({ response, isLoading, onRegenerate }) {
  const [copied, setCopied] = useState(false)
  const [showSources, setShowSources] = useState(true)

  if (isLoading) {
    return (
      <div className="ai-response-container">
        <div className="loading-indicator" aria-live="polite" aria-label="AI generating response">
          <Loading description="IBM watsonx is generating insights…" withOverlay={false} small />
          <span>Analyzing member data across all sources…</span>
        </div>
      </div>
    )
  }

  if (!response) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(response.text || '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="ai-response-container" role="region" aria-label="AI-generated response">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Tag type="blue" size="sm">IBM watsonx · {response.model || 'meta-llama/llama-4-maverick'}</Tag>
          {response.latency && <Tag type="gray" size="sm">{response.latency}ms</Tag>}
          {response.tokens && <Tag type="gray" size="sm">{response.tokens} tokens</Tag>}
          {response.confidence && (
            <Tag type={response.confidence >= 0.85 ? 'green' : response.confidence >= 0.7 ? 'teal' : 'magenta'} size="sm">
              {Math.round(response.confidence * 100)}% confidence
            </Tag>
          )}
          <Tag type="purple" size="sm">{response.mode === 'live' ? 'LIVE' : 'DEMO'}</Tag>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            kind="ghost"
            size="sm"
            renderIcon={Copy}
            iconDescription="Copy response"
            hasIconOnly
            onClick={handleCopy}
            aria-label={copied ? 'Copied!' : 'Copy response'}
            tooltipAlignment="end"
          />
          {onRegenerate && (
            <Button
              kind="ghost"
              size="sm"
              renderIcon={Renew}
              iconDescription="Regenerate"
              hasIconOnly
              onClick={onRegenerate}
              aria-label="Regenerate response"
              tooltipAlignment="end"
            />
          )}
        </div>
      </div>

      <div className="response-text" aria-live="polite">
        {response.text}
      </div>

      {response.sources && response.sources.length > 0 && (
        <div className="sources-section">
          <h5 style={{ cursor: 'pointer' }} onClick={() => setShowSources(!showSources)}>
            <Information size={14} /> Data Sources Used ({response.sources.length})
          </h5>
          {showSources && (
            <div className="source-list">
              {response.sources.map((src, i) => (
                <Tag key={i} type={src.type === 'unstructured' ? 'purple' : 'teal'} size="sm">
                  {src.name}
                </Tag>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
