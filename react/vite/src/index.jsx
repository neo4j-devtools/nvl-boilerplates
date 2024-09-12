import React from 'react'
import { createRoot } from 'react-dom/client'

import { InteractiveNvlWrapper } from '@neo4j-nvl/react'

createRoot(document.getElementById('app')).render(<div style={{ width: '100%', height: 500 }}>
  <InteractiveNvlWrapper
    nvlOptions={{ useWebGL: false, initialZoom: 2.6 }}
    nodes={[{ id: '0', caption: 'graphs' }, { id: '1', caption: 'everywhere' }]}
    rels={[{ from: '0', to: '1', id: '10', caption: 'are' }]}
    mouseEventCallbacks={{
      onZoom: true,
      onPan: true
    }}
  />
</div>)
