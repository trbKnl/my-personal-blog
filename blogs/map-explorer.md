---
title: Coloring a map with data
date: 2025-06-27
description: Efficient map coloring tool using DuckDB running in the browser
---

<h2 class="border-bottom mb-3 mt-5">Content in this Blog Post</h2>

In this blog post I will discuss:

- An interactive tool I made
- The power of web assembly and duck db
- Vibe coding

Lately, I haven't been posting blogs as much, not because I have been sitting still, but because I think the stuff I make is far less interesting to talk about.

Maybe my own interests have been shifting, but mostly I think AI kind of ruined the fun of discovery, and therefore also the fun of sharing the discovery with others.
I mostly "vibe code", and the challenge and fun of discovery is just gone. Most of the things I want to make can be done with little effort, and that is no fun to talk about.

To keep this blog interesting, I'll keep it short and focus on the human aspects of this project.

<h2 class="border-bottom mb-3 mt-5">Interactive tool: Map explorer</h2>

Below you can find a vue3 app that displays a map of the netherlands containing the following [data](https://github.com/sodascience/disease_database). 

This data was produced by [SoDa](https://odissei-soda.nl/).
They harvested more than 80 million Dutch newspaper texts in the period 1830-1940 from Delpher. They identified mentions of locations and diseases in these texts via hand-crafted regex. 
They processed the results and created a user-friendly historical disease database for the following diseases: cholera, diphteria, dysentery, influenza, malaria, measles, scarlet fever, smallpox, tuberculosis, and typhus.

This is an very cool and interesting (and very large) database that begs to be explored and what better way to do that with an interactive map:

<iframe 
  src="https://sodascience.github.io/map-explorer/"
  width="100%" 
  height="800"
  frameborder="0"
  allowfullscreen>
</iframe>

This map is quite fun to play around with (Influenza around the 1900s is quite interesting to see).

In this case the app shows a map of the netherlands together with the disease database, however the app can show any map with any dataset, that map some kind of number to a region.

Here is a link to the [project](https://sodascience.github.io/map-explorer/), if you want to use the app yourself you can fork it and host your own maps.


<h2 class="border-bottom mb-3 mt-5">The power of web assembly and DuckDB</h2>

The initial implementation of the app (Map Explorer) was done in R Shiny. However, Shiny requires a server and is quite slow when dealing with large datasets. The disease database is fairly large.

The challenge for this project was to build an app that applies coloring to a GeoJSON map, is very fast, does not require a server, and is pleasing to look at. To solve it, I opted for a Vue 3 app that runs [DuckDB](https://duckdb.org/) in the browser. 

I stumbled upon DuckDB while researching how to read and load Parquet files client-side. Then I discovered that DuckDB had been ported to WebAssembly. WebAssembly is a fast, low-level code format that runs in the browser, which makes it ideal for this use case. DuckDB can efficiently query large datasets, and the WebAssembly version can do it all on the client side. Ideal, no server needed anymore, and it's very fast: no more waiting around in frustration.

The map itself is built with [D3](https://d3js.org/) for flexibility. Styling is done with Tailwind CSS, because the CSS is right in the HTML for readability, and it's easy to vibe code with.  
Vue glues all the elements together and handles the rendering.

Because this app does not need server logic (the browser only needs to load a couple of files), the app can be hosted on github. Which makes it cheap, and has the added benefit that other people can fork the repository and host and create maps themselves.


<h2 class="border-bottom mb-3 mt-5">ViBE CoDinG</h2>

This app was not really vibe coded (letting the AI fully do its thing, and only giving it some vibes), but nevertheless it has been mostly written by AI, under heavy supervision.

In general, AI has been extremely helpful. Self-contained parts of the code, such as spinners, menus, snippets, and code templates, have been fully written with AI, mostly with Claude, because at the time of writing I got the best results from it. I also used Gemini and ChatGPT; they are less good, but for code snippets and small vibe rewrites they are perfect.

AI has been most helpful with the design of the components. I have very little patience for CSS and styling, and AI can do it so well. However, I still had to use quite a bit of knowledge about CSS and the different layouts to steer the AI in the right direction, and I had to do quite a lot of bug fixing due to conflicting CSS causing problems. But overall, a huge, huge timesaver.

The software patterns I used in the app I decided upon myself (because I still need to be able to fix it when something is wrong).

I also used the AI to refactor my code and rename variables and such. I found it to be very good at that.

Bug fixing I mostly did myself, as the bugs almost always span multiple files and the context window of the free LLMs I used is still too small for the whole codebase (I also don't allow LLMs direct access to the codebase (yet)).

So conclusion: vibe coding is here to stay, is very helpful, and I think if I had access to an AI with a larger context window, I would use it even more. I still think I would heavily guide and oversee the coding process to prevent the AI from writing code that I can't understand or maintain, or that does not meet the project requirements. But in a couple of years, I expect that problem to be solved as well. So then I will reeducate myself and become a carpenter.
