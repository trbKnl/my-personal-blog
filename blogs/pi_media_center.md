---
title: Turn your dumb TV into a smart TV
date: 2024-10-16
description: Learn how to configure a Raspberry PI 5 as a tv media center
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
    <img src="/ctf_flag.jpeg" width="300" class="center">
</p>

<h2 class="border-bottom mb-3 mt-5">Content in this Blog Post</h2>

In this blog post I will discuss how you can use a Raspberry Pi 5 as a small and very capable media center for your TV.

I will discuss:

- The hardware
- The operating systems and software
- The Digital Rights Management (DRM) Software Hell and by extension: why Google sucks
- Software I ended up actually using


<h2 class="border-bottom mb-3 mt-5">The problem: OK TV, But shitty apps</h2>

I am in possesion of an old Sony Bravia HD TV, it's a pretty plain looking black rectangle, exactly what you would expect from a TV. The screen quality and audio quality are nothing to brag about but they are good enough for me, its a perfectly fine TV.

The TV comes with two apps: a YouTube and Netflix apps, and those are the 2 only apps I use it for. These 2 apps is where the TV shows its age, they are unbearably slow, especially YouTube (combine that with all the ads YouTube serves its basically unusable). So its time for an upgrade of the software!

The plan: keep the TV but hook it up to a Raspberry Pi 5 and run android TV on it, so I can enjoy all those sweet android apps (Netflix, Amazon Prime, YouTube etc.) without any lag i.e. turning your old TV into a fast smart TV


<h2 class="border-bottom mb-3 mt-5">The hardware</h2>

For this project I used the following hardware

* [Raspberry Pi 5 8GB RAM](https://www.amazon.com/Raspberry-Pi-Quad-core-Cortex-A76-Processor/dp/B0CTQ3BQLS/ref=sr_1_1?dib=eyJ2IjoiMSJ9.YJ8ceJNaIv19GlrQYNH8s_PO26c0vHouq00ZRwkZTJUVSpUdfbqNdffPTzNQmKkp1hFmF2rzWXoxH0hk_4cMYXHF7OXHIp6nW0zL5220FwzEnZPWNUDv0iwWsqvsvSuWmd_riByPHHZ1mrsJxHTtCzbNUlxpnv5CEfyGD4XRjACudL0au9E4ozTIck4fbmLSxLUD0vHSDesxtiAUcAIJ_PnkhvNZ7iGfm4JIjWVuzPQ.E8aySzGxcMcZv7YSX7CQjNbYRa0k97gvSDduW1GQvPo&dib_tag=se&keywords=raspberry+pi+5+8gb&qid=1729194542&sr=8-1)

     The [Pi 5](https://www.raspberrypi.com/products/raspberry-pi-5/) is very capable but also expensive. I picked it over an Intel NUC, because its still cheaper has a smaller footprint, has also has good IO. I have used it over a month now, and I can confidently say its an extremely smooth (lag free) experience. 

* [Official Raspberry Pi 5 charger](https://www.amazon.nl/-/en/Raspberry-USB-C-Power-Supply-Black/dp/B0CN3MRV16/ref=sr_1_1?crid=2SRAAD9416W94&dib=eyJ2IjoiMSJ9.8AXAjeAvGiTBlk2qyis2YMc1WqfFuqt0Fvjpq6LHoewQErB8kbzsJpQ4LUTrY7ZxZA7HokcbidAVl4s9ndpRvqROu5bwX_8tXero3nO8lDvGYGzSa9c69PAMsgu-ScFVupZRpngbPz1zGVKzxxG7718mPRQVTS9nVRgwPEFl-xX27xrkp1x2VZJdwRUZ9uJQmuEGlwrzTgAhelnI8IJdYsc_YeZouy_5hn9Jke556p713EudbmQcjhJpO_BGPEIgcsfGh2iSi9aUe6AQO48RH_5cmxiMzQW1C-WvzJcaBmw.ynOqKxEwt6MAhTB8nNuD8_An5ZGpuSwGGw7GEGnZTiw&dib_tag=se&keywords=raspberry+pi+5+official+charger&qid=1729194689&sprefix=raspberry+pi+5official+charger%2Caps%2C181&sr=8-1)

    You sort of need to buy the official Raspberry Pi 5 charger for it to function optimally, which is kind of a bummer. It adds another 15 euro's to the costs of the project.

* 2 x [SanDisk Extreme PRO 64GB](https://www.amazon.nl/dp/B09X7BYSFG/ref=pe_28126711_487102941_TE_SCE_dp_1)

    Micro SD card with fast speeds for a good price. You really need fast speeds, because it contains the operating systems we will use. A slow microSD card can really be a performance bottleneck.

* [Flirc Raspberry Pi 5 housing](https://www.amazon.nl/-/en/Flirc-Raspberry-Pi-housing/dp/B0CQNK68L7/ref=sr_1_2?crid=255WR4KVOSJMV&dib=eyJ2IjoiMSJ9.Q1ctBXMnxs7d49HsfvC5hwaWczO50dpngXfFhLSmR6DPKN7wiUGQsoe2vt3eLd65Bo1qR8HxiOu4qUVky9Fu0ujl18XvhlgLkdByr97AKrSMUvn9Ks9bToAVjeztDha9H8MViKY7c9jLuOnGLWhwma-kSarv25MavmTUPD4cMliUcj7_SoMkzcyQgwufj3SPCealylyFwlWBFEo5r-fCHiSN4C_akjkMDYhB1vEygVmttEITaeeRxyo1gdE7Js2t.S5jVy2xBYFGSYHFTniIzoopGbFiJTUA0SLxTVosk8jc&dib_tag=se&keywords=flirc%2Bcase&qid=1729194803&sprefix=flirc%2Bcase%2Caps%2C79&sr=8-2&th=1)

    It is advised to run the Pi 5 with cooling, I know from the Pi 4 that fan cooling can be pretty noisy. Therefore I opted for the Flirc case. The Flirc case is a great looking case made of aluminum that functions as a heat sink, it touches the CPU with a thermal pad. The case actually keeps the temperatures below throtteling levels, and its absolutely silent! This [video](https://www.youtube.com/watch?v=XBGYpScO530) tested the case and other cooling solutions. The case also comes with a powerbutton which is also nice.
    
* [WeChip  W1 Remote](https://www.amazon.com/Wireless-Keyboard-W1-Multifunctional-Projector/dp/B0787Z1C2G/ref=sr_1_2?crid=2C854Z8ILWTHO&dib=eyJ2IjoiMSJ9.GcT8cZOo4wFScqtx-kcndQq5TbIIu0Xl0xh3gkL6woP8hd29wGShHTDR7T6dKuRMDTeySZpbVDs4GBS9ZkJozd03BthnHYpzeGCOL7AyWmB4VXJDroF0cmnXg5uJS6te-Ybc8hOImdDLCqhG7GQ_BU9K5oguCW2X_cB6Wyqud8NLwEqAygNCgIbObvvCvbNqUPW8GHbLW2knjvZ-kQ1nsKUpRHNZyab7xPCTlqWc8cI.8wCVGt9Qixo-X4INQolPAyjdV02S8b7DNFwp9PasZ_Q&dib_tag=se&keywords=WeChip+Air+Mouse+afstandsbediening+met+IR-&qid=1729194620&sprefix=wechip+air+mouse+afstandsbediening+met+ir-%2Caps%2C155&sr=8-2)

    Although all the software I will discuss supports HDMI-CEC, which means you can talk to your PI with your TV remote, my TV remote is kind of shitty so I bought a new one. Its a nice remote with an air mouse and a keyboard, it works out of the box! Most TV that are not ancient support HDMI-CEC, but I leerned TV 


* Samsung SSD 1TB (I have this one for quite a while, I choose it because of fast read and write speeds, which are important)


<h3 class="border-bottom mb-3 mt-5" id="nmap">nmap</h3>

