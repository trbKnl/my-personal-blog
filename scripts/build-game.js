const esbuild = require('esbuild')
const path = require('path')

esbuild.build({
  entryPoints: [path.join(__dirname, '../resources/game/game.js')],
  bundle: true,
  minify: true,
  outfile: path.join(__dirname, '../resources/game/game.bundle.js'),
  format: 'iife',
  platform: 'browser',
}).then(() => {
  console.log('Game bundle built successfully')
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
