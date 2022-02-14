### My Personal Blog with a custom Content Management System

My personal website made with Node, Express and EJS. It has a very simple content management system specifically tailored to my needs. For styling I used Bootstrap CSS.

It works as follows:

1. I write blogs in markdown format it can be mixed with html when needed
2. Metadata is read from the markdown files with `readmetadata.py` and put into a json file
3. The main web page is populated with items in the json file, using the template engine EJS
4. When an article needs to be loaded, it is translated to html on the fly and formatted with EJS. Not efficient, but very convenient (for me).
