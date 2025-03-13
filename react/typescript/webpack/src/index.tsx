import React from 'react'
import { createRoot } from 'react-dom/client'

import { InteractiveNvlWrapper } from '@neo4j-nvl/react'

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<div style={{ width: '100%', height: 500 }}>
    <InteractiveNvlWrapper
      nvlOptions={{ initialZoom: 2.6 }}
      nodes={[{ id: '0', caption: 'graphs' }, { id: '1', caption: 'everywhere' }]}
      rels={[{ from: '0', to: '1', id: '10', caption: 'are' }]}
      mouseEventCallbacks={{
        onZoom: true,
        onPan: true
      }}
    />
  </div>);
} else {
  console.error('No container found');
}
