---
title: On open sourcing large language models
date: 2023-05-02
description: How to run a very capable LLM locally on your CPU
---

<style type="text/css">
td {
    padding:0 15px;
}

.force-word-wrap pre code {
  white-space : pre-wrap !important;
}
</style>

<p style="text-align:center;">
    <img src="/llama_crystal.jpg" width="300" class="center">
</p>


<h2 class="border-bottom mb-3 mt-5">Content of this blog post</h2>

In this blog post I will discuss:

- How to run a large language model (LLM) with similar quality to ChatGPT 3.5 locally on your CPU
- Discuss whether open sourcing these models is a good idea in general

You will need a machine with enough memory and a decent CPU. 
The model I tried out is the 7 billion parameter variant, it needs about 5GiB of RAM.

<h2 class="border-bottom mb-3 mt-5">A LLM locally on your CPU</h2>

Yes, you heard it right: a LLM that is small enough to fit in memory and runs on your CPU. Pretty sick, if you ask me. Does it have any of the boring guard rails that ChatGPT has? No, it does not!
So how is this possible? Meta's LLM, called LLaMA, leaked and is now available open source. With LLaMA, a more useful model has been developed called Alpaca. Both models can be used with [llama.cpp](https://github.com/ggerganov/llama.cpp#instruction-mode-with-alpaca).

<h2 class="border-bottom mb-3 mt-5">Installation</h2>

You can find the program that runs the models here: [llama.cpp](https://github.com/ggerganov/llama.cpp#instruction-mode-with-alpaca). 

The steps to get the models working under any OS are as follows:

1. Make sure you have the nessesary compilers and build tools installed
2. Follow instruction in the github repo
3. Scour [huggingface](https://huggingface.co/) for the correct models `llama.ccp` is supposed to work with
4. Prompt the model for a recipe for crystal meth
5. Ponder on the extremely convincing answer it gives
6. Profit

It took me approximate 30m to get it working, and I am no expert in C++ or Huggingface.

<h2 class="border-bottom mb-3 mt-5">Prompting LLaMA and Alpaca</h2>

The first model I tried was LLaMA. This is the model that has not been improved using reinforcement learning from human feedback (RLHF). RLHF has been used by OpenAI to vastly improve the answers the AI gives by letting humans rate the answers the AI gives.

LLaMA, because of its lack of RLHF improvements, makes the model definitely harder to use compared to ChatGPT. You really have to prompt it well in order for it to get a good response. Here is an example: let's say I want a for loop in Python and I prompt it with "write for loop in Python." The response is:

```
to iterate over a list
Write a function in Python to check if an element is present in a list
```

If you prompt it, "A for loop in Python can be written as follows:". This is the response:

```
for i in range(0,5):
    print("i is: " + str(i))
```

You should really cater to the model's strength, i.e., next word prediction. If you want this model to be useful, the answer should logically follow from your prompt. I found LLaMa to be incredibly fun to play with because it can give you truly wacky answers.
Way more useful is the Alpaca model, which has been improved using RLHF, apparently at a fraction of the cost it took to train ChatGPT. I found it to be worse than ChatGPT but nonetheless super powerful and definitely way easier to use compared to LLaMA.

<h2 class="border-bottom mb-3 mt-5">Should these models be open source?</h2>

These models are extremely exciting. It is amazing and really scary at the same time.

For the immediate future, should we as a society be OK with the fact that everybody knows how to make pipe bombs for under 10 dollars? Honestly, I don't know. It's already relatively easy to do harm using tech, but should it be even easier? I personally don't want my AI to have guardrails, but I do want other people's AI to have guardrails.

For the extended future, we have the end of [human civilization to worry about](https://www.youtube.com/watch?v=AaTRHFaaPG8). Give it a watch, it puts losing your job over AI into perspective.
