---
title: Infrared security camera with the NoIR V2 Camera module for the Raspberry Pi
date: 2022-01-23
description: A motion detection camera in the dark
---

<style type="text/css">
td {
    padding:0 15px;
}
</style>

<p style="text-align:center;">
 <img src="/picamera.jpg" width="600" class="center"> 
</p>

<h3 class="border-bottom mb-3 mt-5" id="goal-of-this-blog-post">Goal of this blog post</h3>

In this blog post you will learn how to setup a Raspberry Pi with the NoIR infrared camera module with motion detection that you can use to film in the night. 

The components I used:
- Raspberry Pi 3B+ 
- Micro SD card
- Phone charger: To charge the Pi
- Infrared light source: [VBESTLIFE Camera IR Illuminator Lights](https://www.amazon.nl/dp/B07DDJ1YDB/ref=pe_28126711_487102941_TE_SCE_dp_1)
- 12 volt adapter for the infrared light source
- An extension cord
- A multiplex wooden board: To screw the components on
- A cardboard box: Housing for the camera
- Duct tape: To tape the camera to the box
- Housing for the Raspberry Pi (optional)

The skills you need:
- Some familiarity with the command line
- You need to know to use SSH (optional, but recommended)

You will end up with:
- A security infrared camera with motion detection that you can access over ssh.

<h3 class="border-bottom mb-3 mt-5" id="goal-of-this-blog-post">Putting the OS for the Raspberry Pi on the micro SD card</h3>

First, you will need to put an operating system for the Raspberry Pi on the micro SD card. I opted for [Raspberry Pi OS Lite](https://www.raspberrypi.com/software/operating-systems/) because it does not have unnecessary software installed already. Remember you can always add software later with `apt-get install`. If you want a desktop environment to be included feel free to choose the "Raspberry Pi OS with desktop" image.

The OS you downloaded is an `.img` file this is a disk image that contains the operating system. Insert the micro SD card into your computer (you might have to use an SD card adapter). Check what the name is of your SD card by running `lsblk` (list block devices), this command lists all drives connected to your system. My SD card shows up as "sda". In your situation it could show up under a different name.

 I will use a program called `dd` to burn this disk image to the micro SD card.
`sudo dd bs=64k if=/path/to/the/OS/2021-10-30-raspios-bullseye-armhf-lite.img  of=/dev/sdX status=progress`. Substitute X for the correct letter. **Warning** this command is also known as disk destroyer, please make sure you burn this image to the correct drive. 

On mac OSX you could also use `dd` on windows you can use some other utility. 

After you have burned the image you are good to go.


<h3 class="border-bottom mb-3 mt-5" id="goal-of-this-blog-post">Install the camera</h3>

Check out [this](https://www.youtube.com/watch?v=T8T6S5eFpqE) video in order to learn how to insert the camera into your Raspberry Pi.

<h3 class="border-bottom mb-3 mt-5" id="goal-of-this-blog-post">Installing the software</h3>

The easiest way to prepare your Pi is to plug it into a monitor and plug in a keyboard. We are going to connect it the your local WiFi network, enable the camera, and enable ssh access so you can access it over the network. 

Log in with the default username: "pi" and password: "raspberry". After that you will be greeted with a command prompt. Issue the command `sudo raspi-config` you will be dropped into a text user interface where you can configure WiFi in "System Options" and you can enable the camera and ssh access in "Interface Options". Now your Pi is connected to your local network and has internet access. 

Now we can preform a system update with `sudo apt-get update && sudo apt-get upgrade`. After that, you can install the motion detection software [motion](https://motion-project.github.io/motion_config.html) with `sudo apt-get install motion` and run the command `sudo modprobe bcm2835-v4l2` read the motion documentation to understand why.

In order to connect to the Pi you will need to know its IP address. Probably your Raspberry Pi will be given an IP address by your router/modem provided by your ISP (also in my case). This IP address is leased and will be temporary this is so your local network will never run out of IP addresses (Imagine all the devices you connected once to your network ate up 1 IP address, you would soon run out). The service that is leasing out IP addresses is called a DHCP server, and most likely it is running on your local router/modem. Log into your router/modem and configure the DHCP server to always give your Pi the same IP. In that case the IP address of your Pi will never change and you always know what the IP is.

If you did not succeed in doing this, you can perform a network scan with `sudo nmap -sn 192.168.1.0/24` to see all the devices on your local network and what IP address they have. `nmap` stands for network map. You can install nmap using your package manager. 

<h3 class="border-bottom mb-3 mt-5" id="goal-of-this-blog-post">Test the Pi camera module</h3>

Its time to see if the camera is working. I tested out the camera using the command `raspistill -o test.jpg`. Which produces an image and stores it in the current directory.

Then I copied this file to my main computer (that has the capability of displaying images) over the network with the `scp` (secure copy command) `scp pi@192.168.1.15:/home/pi/test.jpg ./test.jpg`. I executed this command on my main computer and the command boils down to: copy the file `/home/pi/test.jpg` that is located on 192.168.1.15 (The IP address of the Pi) to the current working directory. If you are uncomfortable doing this you can always transfer files using a USB drive or something, in that case I would also recommend a desktop environment. 


<h3 class="border-bottom mb-3 mt-5" id="goal-of-this-blog-post">Test the motion detection software</h3>

For the motion detection I used the [motion](https://motion-project.github.io/motion_config.html) package we installed earlier. Whenever motion detects movement, it stores the movement in `.mkv` video format.  Honestly, its great! 
You can start motion by running the command
```
sudo motion -c /path/to/your/motion.conf
```
The `-c` flag, specifies a path to your custom config. I recommend copying the default `motion.conf` config file to a directory of your liking. The default config file is located at `/etc/motion/motion.conf`. The default configuration is pretty good out of the box. 

But there are some parameters that I changed. My setup is specifically for filming small critters, so these parameters make sense for me:

```
# Threshold for number of changed pixels that triggers motion.
# The resolution I film at is 640x480, if 100 of those pixel change motion considers it movement
# and it starts to record. This is very sensitive, but I use it to film small critters. So it needs to be sensitive.
threshold 100

# The number of pre-captured (buffered) pictures from before motion.
# I want motion to include 50 frames before it detects motion
# So I get a better idea what is happening pre recording motion might have missed something
pre_capture 50

# Number of frames to capture after motion is no longer detected.
# I want motion to include 50 frames after motion detection 
post_capture 50

# The encoding quality of the movie. (0=use bitrate. 1=worst quality, 100=best)
# I increase the quality of the video output which drastically increases the file size. But I like it this way.
movie_quality 80

# Target directory for pictures, snapshots and movies
# This is the location where motion will store the video files
# I created this folder myself
target_dir /home/pi/motion_files
```

To run motion I use:
```
sudo motion -c /path/to/your/motion.conf & disown
```
`disown` frees up the terminal so you can `exit` the SSH session. If I want motion to stop filming I use `sudo pkill motion` which kills alls processes called `motion`. You can make it way more convenient, but I do not have the need for that personally. Check out the motion website on how to make it more convenient for you.

So the way I used this camera is, every morning I ssh into the raspberry pi, using `ssh pi@<ip-address-of-the-pi>`. Then I change directory with `cd` into `/home/pi/motion_files/`. Then I sort all the videos using `ls -trslh` and I look at the recordings, thei file sizes and their timestamps to see if there is potentially something interesting that I should look at. 


<h3 class="border-bottom mb-3 mt-5" id="goal-of-this-blog-post">Building the camera</h3>

In order to build the camera, I screwed the extension cord, the infrared light, and the Pi (in the housing) to a wooden board. I placed the board inside a cardboard box. Then I cut a hole for the camera with an exacto knife, and I cut a hole for the infrared light. I taped the camera behind the hole with duct tape. 

That is all! Your hobo security cam is finished.


