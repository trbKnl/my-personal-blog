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

<!--<p style="text-align:center;">-->
<!--    <img src="/ctf_flag.jpeg" width="300" class="center">-->
<!--</p>-->

<h2 class="border-bottom mb-3 mt-5">Content in this Blog Post</h2>

In this blog post I will discuss how you can use a Raspberry Pi 5 as a small and very capable media center for your TV.

I will discuss:

- The hardware I bought
- The operating systems and software I ended up using
- The Digital Rights Management (DRM) software hell called Widevine: why Google sucks

<h2 class="border-bottom mb-3 mt-5">The Problem: Decent TV, But Terrible Apps </h2>

I own an old Sony Bravia HD TV, a basic black rectangle—exactly what you'd expect from a TV. The screen and audio quality aren't anything special, but they're good enough for me. It's a perfectly fine TV.

The TV comes with two apps: YouTube and Netflix, and those are the only ones I use. However, this is where the TV shows its age — they are painfully slow, especially YouTube (and combined with all the ads, it's practically unusable). So, it's time to upgrade the software!

The plan is to keep the TV but hook it up to a Raspberry Pi 5 running Android TV, allowing me to enjoy all the Android apps (Netflix, Amazon Prime, YouTube, etc.) without any lag — essentially turning my old TV into a fast smart TV.

<h2 class="border-bottom mb-3 mt-5">The Hardware</h2>

For this project, I used the following hardware:

* [Raspberry Pi 5 8GB RAM](https://www.amazon.com/Raspberry-Pi-Quad-core-Cortex-A76-Processor/dp/B0CTQ3BQLS/ref=sr_1_1?dib=eyJ2IjoiMSJ9.YJ8ceJNaIv19GlrQYNH8s_PO26c0vHouq00ZRwkZTJUVSpUdfbqNdffPTzNQmKkp1hFmF2rzWXoxH0hk_4cMYXHF7OXHIp6nW0zL5220FwzEnZPWNUDv0iwWsqvsvSuWmd_riByPHHZ1mrsJxHTtCzbNUlxpnv5CEfyGD4XRjACudL0au9E4ozTIck4fbmLSxLUD0vHSDesxtiAUcAIJ_PnkhvNZ7iGfm4JIjWVuzPQ.E8aySzGxcMcZv7YSX7CQjNbYRa0k97gvSDduW1GQvPo&dib_tag=se&keywords=raspberry+pi+5+8gb&qid=1729194542&sr=8-1): The [Pi 5](https://www.raspberrypi.com/products/raspberry-pi-5/) is very capable but also expensive. I picked it over an Intel NUC because it's still cheaper, has a smaller footprint, and offers good I/O. I've used it for over a month now, and I can confidently say it's an extremely smooth (lag-free) experience.

* [Official Raspberry Pi 5 charger](https://www.amazon.nl/-/en/Raspberry-USB-C-Power-Supply-Black/dp/B0CN3MRV16/ref=sr_1_1?crid=2SRAAD9416W94&dib=eyJ2IjoiMSJ9.8AXAjeAvGiTBlk2qyis2YMc1WqfFuqt0Fvjpq6LHoewQErB8kbzsJpQ4LUTrY7ZxZA7HokcbidAVl4s9ndpRvqROu5bwX_8tXero3nO8lDvGYGzSa9c69PAMsgu-ScFVupZRpngbPz1zGVKzxxG7718mPRQVTS9nVRgwPEFl-xX27xrkp1x2VZJdwRUZ9uJQmuEGlwrzTgAhelnI8IJdYsc_YeZouy_5hn9Jke556p713EudbmQcjhJpO_BGPEIgcsfGh2iSi9aUe6AQO48RH_5cmxiMzQW1C-WvzJcaBmw.ynOqKxEwt6MAhTB8nNuD8_An5ZGpuSwGGw7GEGnZTiw&dib_tag=se&keywords=raspberry+pi+5+official+charger&qid=1729194689&sprefix=raspberry+pi+5official+charger%2Caps%2C181&sr=8-1): You kind of need to buy the official Raspberry Pi 5 charger for it to work optimally, which is a bit of a bummer. It adds another 15 euros to the project cost.

* 2 x [SanDisk Extreme PRO 64GB](https://www.amazon.nl/dp/B09X7BYSFG/ref=pe_28126711_487102941_TE_SCE_dp_1): MicroSD cards with fast speeds at a good price. You really need fast speeds because they hold the operating system. A slow microSD card can really be a performance bottleneck.

* [Flirc Raspberry Pi 5 Housing](https://www.amazon.nl/-/en/Flirc-Raspberry-Pi-housing/dp/B0CQNK68L7/ref=sr_1_2?crid=255WR4KVOSJMV&dib=eyJ2IjoiMSJ9.Q1ctBXMnxs7d49HsfvC5hwaWczO50dpngXfFhLSmR6DPKN7wiUGQsoe2vt3eLd65Bo1qR8HxiOu4qUVky9Fu0ujl18XvhlgLkdByr97AKrSMUvn9Ks9bToAVjeztDha9H8MViKY7c9jLuOnGLWhwma-kSarv25MavmTUPD4cMliUcj7_SoMkzcyQgwufj3SPCealylyFwlWBFEo5r-fCHiSN4C_akjkMDYhB1vEygVmttEITaeeRxyo1gdE7Js2t.S5jVy2xBYFGSYHFTniIzoopGbFiJTUA0SLxTVosk8jc&dib_tag=se&keywords=flirc%2Bcase&qid=1729194803&sprefix=flirc%2Bcase%2Caps%2C79&sr=8-2&th=1): It's recommended to run the Pi 5 with cooling. From my experience with the Pi 4, fan cooling can be noisy, so I chose the Flirc case. It's a sleek aluminum case that doubles as a heatsink, touching the CPU with a thermal pad. The case keeps temperatures below throttling levels and is completely silent! This [video](https://www.youtube.com/watch?v=XBGYpScO530) compares the case with other cooling solutions. It also comes with a nice power button.

* [WeChip W1 Remote](https://www.amazon.com/Wireless-Keyboard-W1-Multifunctional-Projector/dp/B0787Z1C2G/ref=sr_1_2?crid=2C854Z8ILWTHO&dib=eyJ2IjoiMSJ9.GcT8cZOo4wFScqtx-kcndQq5TbIIu0Xl0xh3gkL6woP8hd29wGShHTDR7T6dKuRMDTeySZpbVDs4GBS9ZkJozd03BthnHYpzeGCOL7AyWmB4VXJDroF0cmnXg5uJS6te-Ybc8hOImdDLCqhG7GQ_BU9K5oguCW2X_cB6Wyqud8NLwEqAygNCgIbObvvCvbNqUPW8GHbLW2knjvZ-kQ1nsKUpRHNZyab7xPCTlqWc8cI.8wCVGt9Qixo-X4INQolPAyjdV02S8b7DNFwp9PasZ_Q&dib_tag=se&keywords=WeChip+Air+Mouse+afstandsbediening+met+IR-&qid=1729194620&sprefix=wechip+air+mouse+afstandsbediening+met+ir-%2Caps%2C155&sr=8-2): Although all the software supports HDMI-CEC, which allows you to control the Pi with your TV remote, my TV remote is kind of bad, so I bought a new one. This remote includes an air mouse and keyboard and works out of the box! Most modern TVs support HDMI-CEC, but I've learned that its never called HDMI-CEC for my Sony TV its called Bravia Sync. Creating the illusion that this is something special only Sony TV's have.

* [Raspberry Pi SD Card Switcher](https://nl.aliexpress.com/item/1005005962679513.html?gatewayAdapt=glo2nld): This allows you to flip a switch to use a different SD card rather than physically swapping them out, convenient.

* Samsung SSD 1TB: I’ve had this for a while; I chose it for its fast read and write speeds, which are important


<h2 class="border-bottom mb-3 mt-5">Software</h2>

### KonstaKANG: Android TV 14

The primary goal is to have a smart TV to watch ad-free YouTube, and I also want to use other apps like Netflix. After some research, I discovered that you can run Android TV 14 on a Raspberry Pi, which allows you to use [SmartTube](https://github.com/yuliskov/smarttube) (ad-free YouTube). Additionally, since you have access to the Play Store, you can install other apps as well.

For the Raspberry Pi, there's a great resource called [KonstaKANG](https://konstakang.com/), which provides builds of Android projects for the Pi and other devices. After seeing some positive feedback on these builds, I decided to give it a try. I followed this [guide](https://konstakang.com/devices/rpi5/LineageOS21/) which is labeled for advanced users. In hindsight, that's kind of true — you need to read the entire page, follow all the steps, and be ready for some troubleshooting. Overall, it’s not difficult, but not for the average user.

I followed all the steps, including installing Widevine L3 (which I had no idea about at the time, but I soon found out!). In the end, I had Android TV 14 running smoothly and fully functional. I installed SmartTube, and mission accomplished! It runs super well, and is a great experience.


### Widevine Bullshit

This is where the bullshit began. I have a Netflix account and wanted to install Netflix on my Raspberry Pi running Android TV 14. To my surprise, I couldn’t find Netflix in the Play Store. Weird, right? I expected it to be there, but it wasn’t. Turns out, this was due to the lack of Widevine L1 support.

So, what is Widevine? It’s digital rights management (DRM) software developed by Google, designed to protect media streams from being ripped using encryption (which clearly isn’t working, given the insane amount of ripped content available online). Widevine L1 provides the highest level of protection, while L3 offers the lowest. With L1, video decryption happens in a trusted execution environment on the hardware itself, making it harder to tamper with. Here’s the catch: who decides whether the trusted execution environment can actually be trusted? You guessed it—Google. For hardware to support Widevine L1, it needs to be certified by Google, which costs a ton of money and will never happen for devices like the Raspberry Pi. So, as a paying customer, I can only watch Netflix on Google-certified devices. Honestly, that’s incredibly crappy. Sure, there are worse problems in the world, but this one’s still kinda shitty.

If I want a premium Netflix experience on my TV, I’m expected to buy a new TV, which feels wasteful to me.

Now, the fact that Netflix doesn’t run without Widevine L1 isn’t entirely Widevine’s fault. There are plenty of other streaming services that work with Widevine L3 (the lowest protection), but they often restrict the video quality to 480p (SD). How did I find out? I installed the NPO Start app to watch Dutch taxpayer-funded TV and noticed the poor streaming quality. NPO also uses Widevine and doesn’t offer HD streams if only L3 is available. That makes no sense to me! As a Dutch consumer, why should I need a Google-certified device to watch high-quality, taxpayer-funded television? That’s disappointing and doesn’t sit right with me. That said, the programs I watch from NPO, like the news and the occasional talk show, are still okay in SD.

Amazon Prime also limits video quality to 480p if only Widevine L3 is available.

So due to the existence and the usage of Widevine, devices like the Raspberry Pi cannot be used to watch (legal subscription based) high quality streams from apps such as Netflix

### Stremio and Torrentio

I was extremely disappointed. Although the primary goal of ad-free YouTube was accomplished, I still have to watch Netflix using my crappy native TV app. So, I started exploring other must-have apps for Android TV and found Stremio.

[Stremio](https://github.com/Stremio) is an app that lets you watch streams, and when combined with the [Torrentio plugin](https://stremio-addons.netlify.app/torrentio.html), it allows you to stream torrent content as you download it. It works incredibly well. The setup was simple, with no frustration, and it gives access to all the content in the world. Plus, it works on non-certified Widevine L1, L2, and L3 devices. Honestly, I wonder why people still consume video content illegally \s.

### LibreELEC: Kodi

I also wanted to install [Kodi](https://kodi.tv/), the open-source home theater software that works super well and is widely loved and supported.

I tried installing Kodi on the KonstaKANG Android TV 14 build, but it kept crashing randomly. So, I installed [LibreELEC](https://libreelec.tv/) on another SD card (`dd if=./libreelec.iso of=/dev/sdX status=progress`), and had Kodi up and running in no time. Kodi with LibreELEC on the Pi 5 is fantastic. The performance is great: it feels super responsive, and you get fast playback, which is really nice.


<h2 class="border-bottom mb-3 mt-5">Conclusion</h2>

If you end up going this route, you will end up with a very capable, really small, dead silent media Linux media computer.

Would I recommend this as a solution to upgrade your crappy TV. Probably not, all the components together are quite expensive and given the existence of Widevine you are better off buying a new TV, which is sad.

But if you like to have a media PC attached to your PC anyway and were looking at Intel NUC's


