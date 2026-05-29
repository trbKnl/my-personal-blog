const chokidar = require('chokidar')
const { exec } = require('child_process')

const watcher = chokidar.watch('./blogs', { persistent: true, ignoreInitial: true })

function run(cmd) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) console.error(error.message)
    if (stderr) console.error(stderr)
    if (stdout) console.log(stdout)
  })
}

watcher
  .on('change', file => run(`node ./scripts/build.js ${file}`))
  .on('add', () => run('node ./scripts/build.js'))
  .on('unlink', () => run('node ./scripts/build.js'))

console.log('Watching ./blogs')
