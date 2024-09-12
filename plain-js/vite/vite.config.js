import { defineConfig } from 'vite'

export default defineConfig({
    optimizeDeps: {
      exclude: ['@neo4j-nvl/layout-workers'],
      include: [
        '@neo4j-nvl/layout-workers > cytoscape',
        '@neo4j-nvl/layout-workers > cytoscape-cose-bilkent',
        '@neo4j-nvl/layout-workers > @neo4j-bloom/dagre',
        '@neo4j-nvl/layout-workers > bin-pack',
        '@neo4j-nvl/layout-workers > graphlib'
      ],
      esbuildOptions: {
        target: 'es2020'
      }
    }
  })