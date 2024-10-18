# niekdeschipper.com

My personal website made with Node, Express and EJS. It has a very simple content management system specifically tailored to my needs. For styling I used Bootstrap CSS.
Basicially, this is a really constraint and inefficient static site generator. Which works perflectly fine!  

It works as follows:

1. I write blogs in markdown format it can be mixed with html when needed
2. Metadata is read from the markdown files with and put into a json file this file is used to generate index.html
3. Markdown is transformed into static html and is served by express

# Installation

## Python

Install python dependencies:

```
markdown2
feedgen
```

Install them globally or use a virtual environment.


## Node

```
npm install
```


# Usage


To run the development server

```
npm run dev
```

To build the blog

```
npm run build
```

### Use this blog for yourself

If you want to use this blog for yourself, remove the blogs in `./blog` and put in your own.

