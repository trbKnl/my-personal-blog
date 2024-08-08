# niekdeschipper.com

My personal website made with Node, Express and EJS. It has a very simple content management system specifically tailored to my needs. For styling I used Bootstrap CSS.
Basicially, this is a really constraint and inefficient static site generator. Which works perflectly fine!  

It works as follows:

1. I write blogs in markdown format it can be mixed with html when needed
2. Metadata is read from the markdown files with and put into a json file in `scripts`: `python3 generate_metadata.py`
3. Static html is created with `node generate_html.js`
4. Static html is served by the server

