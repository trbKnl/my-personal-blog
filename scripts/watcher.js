const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

const watchDir = './blogs';


function execWrapper(cmd) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(stderr);
    }
    console.log(stdout);
  });
}

function renderMarkdown(filePath) {
  const renderMarkdownScript = './scripts/generate_html.js';
  execWrapper(`node ${renderMarkdownScript} ${filePath}`)
}

function generateBlogMetadata() {
  const generateBlogMetadataScript = './scripts/generate_metadata.py';
  execWrapper(`python ${generateBlogMetadataScript}`)
}


// Create a watcher
const watcher = chokidar.watch(watchDir, {
  persistent: true,
  ignoreInitial: true
});

// Function to execute a script
// Watch for file changes
watcher.on('change', (filePath) => {
  console.log(`File ${filePath} has been changed`);
  renderMarkdown(filePath);
});

// Watch for file additions and removals
watcher.on('add', (filePath) => {
  console.log(`File ${filePath} has been added`);
  generateBlogMetadata()
});

watcher.on('unlink', (filePath) => {
  console.log(`File ${filePath} has been removed`);
  generateBlogMetadata()
});

console.log(`Watching directory: ${watchDir}`);
