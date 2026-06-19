const express = require("express")
var compression = require("compression")
const fs = require("fs")
const { networkInterfaces } = require("os")

/* Start server here */
const app = express();

// Use compression
app.use(compression());

// enable ejs 
app.set('view engine', 'ejs')

// resources directory for images and such
// bootstrap css file
const staticOpts = { maxAge: '7d' };
app.use(express.static(__dirname + '/resources', staticOpts));
app.use("/projects", express.static(__dirname + '/projects', staticOpts));
app.use("/rss", express.static(__dirname + '/rss', staticOpts));

// read in the metadata file to display the blog posts
var metadata = JSON.parse(fs.readFileSync('./blogmetadata.json', 'utf8'));

app.get('/', (req, res) => {
    res.render('index', {
        metadata: metadata
    })
});



const PORT = 8080
const lanIp = Object.values(networkInterfaces()).flat().find(n => n.family === 'IPv4' && !n.internal)?.address

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Local:   http://localhost:${PORT}`)
    if (lanIp) console.log(`Network: http://${lanIp}:${PORT}`)
});

