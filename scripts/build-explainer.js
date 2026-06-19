// scripts/build-explainer.js
const esbuild = require('esbuild')
const path    = require('path')

esbuild.build({
  entryPoints: [path.join(__dirname, '../word-game-explainer.js')],
  bundle:      true,
  minify:      true,
  outfile:     path.join(__dirname, '../resources/word-game-explainer.bundle.js'),
  format:      'iife',
  platform:    'browser',
}).then(() => {
  console.log('Explainer bundle built successfully')
}).catch(err => {
  console.error(err)
  process.exit(1)
})
