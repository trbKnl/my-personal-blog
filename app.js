const express = require("express")
var compression = require("compression")
const fs = require("fs")

/* Start server here */
const app = express();

// Use compression
app.use(compression());

// enable ejs 
app.set('view engine', 'ejs')

// resources directory for images and such
// bootstrap css file
app.use(express.static(__dirname + '/resources'));
app.use("/projects", express.static(__dirname + '/projects'));
app.use("/rss", express.static(__dirname + '/rss'));

// read in the metadata file to display the blog posts
var metadata = JSON.parse(fs.readFileSync('./blogmetadata.json', 'utf8'));

app.get('/', (req, res) => {
    res.render('index', {
        metadata: metadata
    })
});



const PORT = 8080
app.listen(PORT, () => { 
    console.log(`Server started on http://localhost:${PORT}`)
});

