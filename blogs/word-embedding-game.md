---
title: Word Embedding Game
date: 2026-06-11
description: Sort words along a semantic spectrum determined by word embeddings
---

<link rel="stylesheet" href="/word-game/game.css">

<div id="word-game-container"></div>

<script defer src="/word-game/game.bundle.js"></script>

<h2 class="border-bottom mb-3 mt-5">What are word embeddings?</h2>

Word embeddings are a way of representing words as points in high-dimensional space, trained on massive text corpora so that semantically similar words end up near each other. A classic result: `king - man + woman ≈ queen`. The geometry encodes meaning.

This game uses those geometric relationships directly. For each level, two opposing concepts define a spectrum — say, **HAPPY** on one end and **SAD** on the other. Five words are placed along that axis according to their actual embedding positions. Your job: figure out the order.

<h2 class="border-bottom mb-3 mt-5">Visualizing the geometry</h2>

The animation below shows exactly what happens under the hood. Step through it with the buttons:

<div id="wge-root" style="margin: 24px 0;"></div>
<script defer src="/word-game-explainer.bundle.js"></script>

<h2 class="border-bottom mb-3 mt-5">How to play</h2>

Drag the word cards into order from left (first concept) to right (second concept). Hit **Submit** to see how you did. Scoring counts how many of the 10 word-pairs you ordered correctly — getting 8 or more right triggers confetti.

Use the **⚙** icon to pick a specific concept from the 68 available pairs.
