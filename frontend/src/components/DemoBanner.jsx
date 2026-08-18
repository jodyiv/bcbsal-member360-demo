import React from 'react'
import { InlineNotification } from '@carbon/react'

export default function DemoBanner() {
  return (
    <div className="demo-banner" role="banner" aria-label="Demo environment notice">
      <InlineNotification
        kind="info"
        title="Demonstration Environment — "
        subtitle="All data is synthetic. No real member PII, claims, or clinical data is used. Built with IBM watsonx."
        hideCloseButton
        lowContrast={false}
      />
    </div>
  )
}
