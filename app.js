const express = require("express")
const fs = require('fs');

// custom routers 
const projectRouter = require("./routes/projects")


/* Start server here */
const app = express();

// enable ejs 
app.set('view engine', 'ejs')

//bootstrap css files
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// resources directory for images and such
app.use(express.static(__dirname + '/resources'));


// create a route for all the articles 
app.use('/projects', projectRouter)

// read in the metadata file to display the blog posts
var metadata = JSON.parse(fs.readFileSync('blogmetadata.json', 'utf8'));

app.get('/', (req, res) => {
    res.render('index', {
        metadata: metadata
    })
});


const PORT = 8080
app.listen(PORT, () => { 
    console.log(`Server started on http://localhost:${PORT}`)
});


