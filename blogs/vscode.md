---
title: Become a Linux bro on Windows
date: 2023-07-14
description: Integrate VSCode with Windows Subsystem for Linux
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
    <img src="/hackerpinguin.jpg" width="600" class="center">
</p>


<h2 class="border-bottom mb-3 mt-5">Content of this blog post</h2>

This blog post will discuss two main topics:

* Why you should integrate Linux into VSCode
* How to integrate VSCode with WSL

The motivation begind this blog post stems from my frustration that everything from a developer perspective is harder on Windows compared to MacOSX and especially Linux. Windows documentation is not the best, you have no way of doing package management properly and you miss out on tons of useful (and free) programs.

For myself that is not really a problem, I can just ignore Windows, except for the fact that I sometimes have work with data analysts/scientists/engineers that are using Windows (for good reason, it works just fine) and I have to instruct them to use or install certain programs or use shell scripts. That is where the nightmares start. Multiple times I ran into versioning problems, but there was a specific event that got me especially tilted. It was a researcher that consistently kept trying to execute (`bash`) shell scripts in powershell and emailing me it did not work.

In comes windows subsystem for linux (WSL) with VSCode, a great alternative to the Windows experience (and no dual boot shenanigans). You get a very nice code editor with all the relevant features: nice plugins, a file browser, buttons (for the button lovers), integrated terminal, everything you would need. And it integrates with Windows subsystem for Linux, you can effectively run Ubuntu and use all the convenience that Ubuntu provides. In my opinion this is the best of both worlds for people that really need or want to use Windows.


<h2 class="border-bottom mb-3 mt-5">Ubuntu on Windows</h2>

To install WSL, follow these steps:

* Enable kernel virtualization in your BIOS. For AMD CPUs, it's called SVM mode, and for Intel CPUs, it's called Virtualization Technology. Access your BIOS settings and toggle this option on.
* Open PowerShell as an administrator and execute the command `wsl --install` (also see the [official docs](https://learn.microsoft.com/en-us/windows/wsl/)). This will install Ubuntu by default.

That's it! Now you can run both Windows and Ubuntu simultaneously!

<h2 class="border-bottom mb-3 mt-5">Integrate WSL with VSCode</h2>

Follow these [instructions](https://code.visualstudio.com/docs/remote/wsl). It amounts to openings VSCode and clicking a single button. Now you are using your Ubuntu operating system in VSCode.

<h2 class="border-bottom mb-3 mt-5">What's next!?</h2>

Marvel at the fact you are running two OS'es at the same time. After that a great first step would be to familiarize yourself with the Ubuntu operating system. You can do so by:

* [linuxjourney.com](https://linuxjourney.com/)
* Opening your terminal (in VSCode) and experimenting with various [commands](https://niekdeschipper.com/projects/tutorial.md)
* Start installing software and witness how easy it is to do so.
* Follow tutorials that before you couldn't, because you were using pure Windows


