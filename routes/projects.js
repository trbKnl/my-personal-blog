const express = require('express')
const fs = require('fs');
const matter = require('gray-matter');

var hljs = require('highlight.js');
var md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
})

const router = express.Router()


router.get('/:id', (req, res) => {

    var id = req.params.id
    console.log(`This is the requested id ${id}`)
    var file

    try {
        file = fs.readFileSync(__dirname + '/../blogs/' + id, 'utf-8')
        var result = matter(file)
        var content = md.render(result.content);

        res.render('blog', {
            title: result.data.title,
            description: result.data.description,
            content : content
        })
    } catch (err) {
        console.log(err)
        res.send(`<h1> Article: ${id} not found </h1>`)
    }
})


module.exports = router


