const express = require("express")
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


// Read blogs and render to html
const rawBlogDirectory  = process.cwd() + "/blogs/" 
const renderedBlogDirectory = process.cwd() + "/projects/" 
const templatePath = process.cwd() + "/views/blog.ejs" 
const template = fs.readFileSync(templatePath, 'utf-8');

fs.readdir(rawBlogDirectory, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err)
    return
  }

  files.forEach(file => {
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
    const filePath = renderedBlogDirectory + "/" + filename

    fs.writeFile(filePath, htmlBlog, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to file:', err)
      } else {
        console.log('Data has been written to the file:', filePath)
      }
    })
  })
})

