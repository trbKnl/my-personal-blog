---
title: Rip your favorite tracks from your music subscription service
date: 2021-12-10
description: How to record songs playing from your speaker
---

<style type="text/css">
td {
    padding:0 15px;
}
</style>

<p style="text-align:center;">
 <img src="/pirate.png" width="300" class="center"> 
</p>

<h3 class="border-bottom mb-3 mt-5" id="goal-of-this-blog-post">Goal of this blog post</h3>

Want to be a l33t h4cker pirate? Look no further, you have come to the right place! In this blog post you will get some idea on how to start ripping music. 

In this blog post I will discuss:

* The skeleton of a shell script that could be used to record music directly from your souncard

The take away from this blog post is that shell scripting in combination with free programs from your distributions repository (or Mac OSX homebrew or what repo is available on Windows these days) is very powerful and is often more than enough to get your job done. This is a great example where I think a shell script really shines.

*Disclaimer: I will not provide a working script, I will merely give some pointers on how to record music from your sound device directly. I do not endorse the illegal distribution of pirated music! Just use it for your own consumption.*

<h3 class="border-bottom mb-3 mt-5" id="goal-of-this-blog-post">How to rip music</h3>

At some point in time I wanted to make a mix tape, in order to do that I needed the songs so I could mix them. My first idea was to create a youtube playlist containing all my songs I wanted to mix and then to use `youtube-dl` to extract the audio from the videos in the playlist. This does work, and is straightforward, but the audio quality is not very good. I wanted to play this mix tape once on an event, and people would listen to it using headphones, therefore I did needed normal audio quality.

So I went for plan B; recording the tracks I wanted straight from a paid music subscription service. The procedure I ended up using is as follows:

1. Extract a playlist you want to record from your paid music subscription service
2. For each song do
    1. Extract, the name of the song, the artists name, and the duration of the song using the API of the paid music subscription service
    2. Start the song
    3. For the duration of the song: Capture the stream of bytes going to your sound card, and store it as a .wav file
    4. Stop the song


This is the script:

```bash
#!/bin/sh

while read -r p; do

    trackId=$(Extract the trackId from the playlist) 
    # Start the song with the extracted trackId
    # Stop the song on your music streaming subscription with the provided API by the subscription
    sleep 2

    title=$(Extract the song title of the song currently playing)
    artist=$(Extract the artist of the song currently playing)
    time=$(Extract the time remaning of the song currently playing)

    artist=$(Format the artist nicely with sed)
    title=$(Format the title of the song with sed)

    filename="$artist-$title.wav"

    if [ ! -f "$filename"  ]; then
        echo "recording" "$filename"
        # Start the song with the API provided by your music streaming subscription
        timeout "$time"s pacat --record -d alsa_output.pci-0000_00_1f.3.analog-stereo.monitor | sox -t raw -r 44100 -L -e signed-integer -S -b 16 -c 2 - "$filename"
        # Stop the song with the API provided by your music streaming subscription
    else
        echo "$filename" already exists
    fi

done < "$1"
```

This script takes as input a file containing all the songs in the playlist. The script stops after all the lines in the input file have been processed. Most of the shell script is there to automate the extraction of the metadata of the songs you want to record, and it is really specific to the API of music subscription service that you are using.

This line is where the magic happens,

```bash
timeout "$time"s pacat --record -d alsa_output.pci-0000_00_1f.3.analog-stereo.monitor | sox -t raw -r 44100 -L -e signed-integer -S -b 16 -c 2 - "$filename"
```

In this line, `timeout` in runs a command for the duration of `$time` seconds. In this case the `pacat` command records the audio streaming going to my monitor and streams the bytes to the `sox` command, which encodes the stream as a `.wav` file. I use `pacat` because I use Pulseaudio as my audio server, if you use a different audio server there probably exists something very similar. The `sox` commando, also known as "SoX - Sound eXchange, the Swiss Army knife of audio manipulation" encodes the stream to a `.wav` file. I do not know all the ins and outs of `sox` but in this case it was very useful. The recording stops when the song should be done, and the next song is started. If you want to do this yourself you have to change some things in order to get this to work. 


<h3 class="border-bottom mb-3 mt-5" id="goal-of-this-blog-post">Conclusion</h3>

Shell scripting is just so convenient to get work done quickly. The programs `pacat` and `sox` where in my user repository and were very easily installed using my package manager, and using pipes (`|`) they efficiently work together! I hope that after this you will be inspired to make your own shell scripts, and that your realize that bending a computer to your will is not that hard (at least not on Linux 😉)! 

And making this script was way more fun than the actual mixing of the music!
