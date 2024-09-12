import { NVL } from '@neo4j-nvl/base'
import { ZoomInteraction, PanInteraction } from '@neo4j-nvl/interaction-handlers'

const container = document.getElementById('app')
const nodes = [{ id: '0', caption: 'graphs' }, { id: '1', caption: 'everywhere' }]
const relationships = [{ from: '0', to: '1', id: '0-1', caption: 'are' }]

const nvl = new NVL(container, nodes, relationships, { useWebGL: false, initialZoom: 2.6 })

const zoom = new ZoomInteraction(nvl)
const pan = new PanInteraction(nvl)
