const fs = require("fs")
const matter = require("gray-matter")
const path = require('path');
const ejs = require('ejs')
let hljs = require("highlight.js")
let md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }

    return "" // use external default escaping
  }
})


function renderMarkdown(file) {
  const blogPath = path.join(rawBlogDirectory, file)

  // tranform md to html
  const rawBlog = fs.readFileSync(blogPath)
  const result = matter(rawBlog)
  const content = md.render(result.content);

  const htmlBlog = ejs.render(template, {
      title: result.data.title,
      description: result.data.description,
      content : content
  })

  // write html to renderedBlogDirectory
  const filename = path.basename(file, path.extname(file)) + ".html"
  const filePath = renderedBlogDirectory + filename

  fs.writeFile(filePath, htmlBlog, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to file:', err)
    } else {
      console.log('Markdown converted to html:', filePath)
    }
  })
}


// Define constants
const projectRoot = __dirname // equal to where the script is located
const rawBlogDirectory  = projectRoot + "/../blogs/" 
const renderedBlogDirectory = projectRoot + "/../projects/" 
const templatePath = projectRoot + "/../views/blog.ejs" 

const template = fs.readFileSync(templatePath, 'utf-8'); // read template
const args = process.argv.slice(2); // get commandline arguments


function main() {
  if (args.length > 0) {
    renderMarkdown(path.basename(args[0]));
  } else {
    fs.readdir(rawBlogDirectory, (_, files) => {
      files.forEach(file => {
        renderMarkdown(file)
      })
    })
  }
}

main()
