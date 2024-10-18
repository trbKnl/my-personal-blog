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

## The Problem: Decent TV, But Terrible Apps

I own an old Sony Bravia HD TV, a basic black rectangle—exactly what you'd expect from a TV. The screen and audio quality aren't anything special, but they're good enough for me. It's a perfectly fine TV.

The TV comes with two apps: YouTube and Netflix, and those are the only ones I use. However, this is where the TV shows its age — they are painfully slow, especially YouTube (and combined with all the ads, it's practically unusable). So, it's time to upgrade the software!

The plan is to keep the TV but hook it up to a Raspberry Pi 5 running Android TV, allowing me to enjoy all the Android apps (Netflix, Amazon Prime, YouTube, etc.) without any lag — essentially turning my old TV into a fast smart TV.

## The Hardware

For this project, I used the following hardware:

* [Raspberry Pi 5 8GB RAM](https://www.amazon.com/Raspberry-Pi-Quad-core-Cortex-A76-Processor/dp/B0CTQ3BQLS/ref=sr_1_1?dib=eyJ2IjoiMSJ9.YJ8ceJNaIv19GlrQYNH8s_PO26c0vHouq00ZRwkZTJUVSpUdfbqNdffPTzNQmKkp1hFmF2rzWXoxH0hk_4cMYXHF7OXHIp6nW0zL5220FwzEnZPWNUDv0iwWsqvsvSuWmd_riByPHHZ1mrsJxHTtCzbNUlxpnv5CEfyGD4XRjACudL0au9E4ozTIck4fbmLSxLUD0vHSDesxtiAUcAIJ_PnkhvNZ7iGfm4JIjWVuzPQ.E8aySzGxcMcZv7YSX7CQjNbYRa0k97gvSDduW1GQvPo&dib_tag=se&keywords=raspberry+pi+5+8gb&qid=1729194542&sr=8-1)

     The [Pi 5](https://www.raspberrypi.com/products/raspberry-pi-5/) is very capable but also expensive. I picked it over an Intel NUC because it's still cheaper, has a smaller footprint, and offers good I/O. I've used it for over a month now, and I can confidently say it's an extremely smooth (lag-free) experience.

* [Official Raspberry Pi 5 charger](https://www.amazon.nl/-/en/Raspberry-USB-C-Power-Supply-Black/dp/B0CN3MRV16/ref=sr_1_1?crid=2SRAAD9416W94&dib=eyJ2IjoiMSJ9.8AXAjeAvGiTBlk2qyis2YMc1WqfFuqt0Fvjpq6LHoewQErB8kbzsJpQ4LUTrY7ZxZA7HokcbidAVl4s9ndpRvqROu5bwX_8tXero3nO8lDvGYGzSa9c69PAMsgu-ScFVupZRpngbPz1zGVKzxxG7718mPRQVTS9nVRgwPEFl-xX27xrkp1x2VZJdwRUZ9uJQmuEGlwrzTgAhelnI8IJdYsc_YeZouy_5hn9Jke556p713EudbmQcjhJpO_BGPEIgcsfGh2iSi9aUe6AQO48RH_5cmxiMzQW1C-WvzJcaBmw.ynOqKxEwt6MAhTB8nNuD8_An5ZGpuSwGGw7GEGnZTiw&dib_tag=se&keywords=raspberry+pi+5+official+charger&qid=1729194689&sprefix=raspberry+pi+5official+charger%2Caps%2C181&sr=8-1)

    You kind of need to buy the official Raspberry Pi 5 charger for it to work optimally, which is a bit of a bummer. It adds another 15 euros to the project cost.

* 2 x [SanDisk Extreme PRO 64GB](https://www.amazon.nl/dp/B09X7BYSFG/ref=pe_28126711_487102941_TE_SCE_dp_1)

    MicroSD cards with fast speeds at a good price. You really need fast speeds because they hold the operating system. A slow microSD card can really be a performance bottleneck.

* [Flirc Raspberry Pi 5 Housing](https://www.amazon.nl/-/en/Flirc-Raspberry-Pi-housing/dp/B0CQNK68L7/ref=sr_1_2?crid=255WR4KVOSJMV&dib=eyJ2IjoiMSJ9.Q1ctBXMnxs7d49HsfvC5hwaWczO50dpngXfFhLSmR6DPKN7wiUGQsoe2vt3eLd65Bo1qR8HxiOu4qUVky9Fu0ujl18XvhlgLkdByr97AKrSMUvn9Ks9bToAVjeztDha9H8MViKY7c9jLuOnGLWhwma-kSarv25MavmTUPD4cMliUcj7_SoMkzcyQgwufj3SPCealylyFwlWBFEo5r-fCHiSN4C_akjkMDYhB1vEygVmttEITaeeRxyo1gdE7Js2t.S5jVy2xBYFGSYHFTniIzoopGbFiJTUA0SLxTVosk8jc&dib_tag=se&keywords=flirc%2Bcase&qid=1729194803&sprefix=flirc%2Bcase%2Caps%2C79&sr=8-2&th=1)

    It's recommended to run the Pi 5 with cooling. From my experience with the Pi 4, fan cooling can be noisy, so I chose the Flirc case. It's a sleek aluminum case that doubles as a heatsink, touching the CPU with a thermal pad. The case keeps temperatures below throttling levels and is completely silent! This [video](https://www.youtube.com/watch?v=XBGYpScO530) compares the case with other cooling solutions. It also comes with a nice power button.

* [WeChip W1 Remote](https://www.amazon.com/Wireless-Keyboard-W1-Multifunctional-Projector/dp/B0787Z1C2G/ref=sr_1_2?crid=2C854Z8ILWTHO&dib=eyJ2IjoiMSJ9.GcT8cZOo4wFScqtx-kcndQq5TbIIu0Xl0xh3gkL6woP8hd29wGShHTDR7T6dKuRMDTeySZpbVDs4GBS9ZkJozd03BthnHYpzeGCOL7AyWmB4VXJDroF0cmnXg5uJS6te-Ybc8hOImdDLCqhG7GQ_BU9K5oguCW2X_cB6Wyqud8NLwEqAygNCgIbObvvCvbNqUPW8GHbLW2knjvZ-kQ1nsKUpRHNZyab7xPCTlqWc8cI.8wCVGt9Qixo-X4INQolPAyjdV02S8b7DNFwp9PasZ_Q&dib_tag=se&keywords=WeChip+Air+Mouse+afstandsbediening+met+IR-&qid=1729194620&sprefix=wechip+air+mouse+afstandsbediening+met+ir-%2Caps%2C155&sr=8-2)

    Although all the software supports HDMI-CEC, which allows you to control the Pi with your TV remote, my TV remote is kind of bad, so I bought a new one. This remote includes an air mouse and keyboard and works out of the box! Most modern TVs support HDMI-CEC, but I've learned that...

* [Raspberry Pi SD Card Switcher](https://nl.aliexpress.com/item/1005005962679513.html?gatewayAdapt=glo2nld)

    This allows you to flip a switch to use a different SD card, rather than physically swapping them out.

* Samsung SSD 1TB (I’ve had this for a while; I chose it for its fast read and write speeds, which are important).


asd
