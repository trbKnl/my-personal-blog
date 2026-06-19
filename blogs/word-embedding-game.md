---
title: Word Embedding Game
date: 2026-06-11
description: Sort words along a semantic spectrum determined by word embeddings
---

<link rel="stylesheet" href="/word-game/game.css">

<div id="word-game-container"></div>

<script defer src="/word-game/game.bundle.js"></script>

<h2 class="border-bottom mb-3 mt-5">What are word embeddings?</h2>

Word embeddings are a way of representing words as points in high-dimensional space, trained on massive text corpora so that semantically similar words end up near each other. These word embeddings encode the meaning of words and are used as a basis for large language models.

You could also make a game using these word embeddings. The game you see above uses those geometric relationships directly. For each level, two opposing concepts define a spectrum, say, **HAPPY** on one end and **SAD** on the other. Five words are placed along that axis according to their actual embedding positions. Your job: figure out the order.

<h2 class="border-bottom mb-3 mt-5">Visualizing the geometry</h2>

The animation below shows exactly what happens under the hood. Step through it with the buttons:

<div id="wge-root" style="margin: 24px 0;"></div>
<script defer src="/word-game-explainer.bundle.js"></script>

<h2 class="border-bottom mb-3 mt-5">How the game was made: design considerations</h2>

An earlier version of the game used word2vec, one of the first popular word embeddings. I tried it out and it did not work that well, meaning that the semantic relationship between words didn't feel right yet, and this game is all about feeling more or less right to a human. So I used different word embeddings: [all-mpnet-base-v2](https://huggingface.co/sentence-transformers/all-mpnet-base-v2), and that was already a great improvement.

Another important design consideration is to make sure that all words relate to the concepts on the semantic axis, so also the middle words have to be actually related to both concepts. In the first prototype most middle words were unrelated to the 2 concepts and although technically it would sit in the middle, it just feels weird.

So then the next step was to have AI generate interesting concepts. AI generated 68 interesting concepts, I vibed a level editor with the criteria: all words have to relate to at least one concept, all words should more or less spread out over the whole spectrum, and words that fall heavily outside the spectrum are excluded.

The end result is a pretty fun game! And an endless amount of levels can be created, with a highscore system, daily random levels etc. So currently its a fun novelty game, but it could become something more.
