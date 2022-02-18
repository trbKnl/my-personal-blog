---
title: TCP and UDP hole punching through NAT devices
date: 2022-02-20
descrIPtion: Learn to simulate a lab environment for testing purposes
---

## Goal of this blog post

I saw [this](https://www.youtube.com/watch?v=TiMeoQt3K4g) very insightful video from Engineer Man in which he explains UDP hole punching. 
I wanted to know more about it, and I to replicate his setup but without renting virtual machine from a cloud provider. 
I want to have full control over all the parts involved in order to create an network environment that can be used for testing network applications. 
This blog post will show how to replicate the video of Engineer Man on your own machine, with virtual machines.

The thing I initially set out to study was whether I could identify conditions when hole punching works and when it fails. 
You can find an answer to this question on the internet, but I was not really satisfied with those answers, so I will present my own answer with detailed examples.

In this blog post you will learn:

- Conditions when hole punching does work
- Creating virtual machines with libvirt
- Configuring bridge networks with netplan
- Simulating machines behind different NAT's (aka people on computers in their homes on their own WiFi)
- Firewalling and routing with net filter tables (`nft`)

You need to know:

- The basic of TCP, UDP and IP 
- A familiarity with the command line
- Optional, it really helps to have some familiarity with networking concepts

You need to have:

- A system with Linux
- A CPU that allows for virtualization (relatively modern CPU's support that)


## What is NAT and why do we need it?

NAT stands for network address translation, and for the rest of the blog I will use the word NAT to denote a device that does network address translation. In a typical home setup, the router that you got from your internet service provider (ISP) does network address translation. Why do we need a NAT? Because the internet still works mainly on IPv4 and there are only a limited number of IP addresses. To protect the number of IP addresses in the world we mostly operate behind NATs. You can have a lot of devices on your local network behind a NAT, but from the outside world traffic all seems to come from the same IP address.

This is a reason why its very hard to convict someone for pirating copyright material, because its hard to determine which exact device did the downloading. This is also the reason you cannot sent TCP/IP packets directly to your grandma PC. You can send packets to your grandma's public IP but you have no way of specifying to which actual device the packet should go to. Here is a picture with an example of two private networks behind NAT devices.

<p style="text-align:center;">
    <img src="/networksbehindNAT.svg" width="600">
</p>

You could argue that having a NAT device as a gateway to the internet is a form of weak protection. One cannot send packets directly to you when you did not initiate contact first and it provides a weak form or anonymity: was it you or your roommate that downloaded that movie?

The main problem with devices behind NATs is: how do you initiate contact with another peer behind a NAT? One solution could be: client B configures his NAT in such a way that all traffic on port 80 gets forwarded to his device (this is called "port forwarding"). Then he has a program listening on port 80 for incoming traffic and handles it accordingly. client A can send traffic to the public IP of client B to port 80, knowing that it will be forward to his device.

This solution works, but you have to configure port forwarding which is not very convenient and if client C (behind the same NAT as B) wants to talk to client A they have to negotiate another port number, because all incoming traffic on port 80 is being forwarded to client A already. 

Another solution would be to have a service that acts as a relay between clients (for example Discord), or communications could go directly from peer to peer. But how do you establish a peer to peer network connection when clients are behind NATs, that is where TCP or UDP hole punching comes in.

*Note:* We would not need NAT if the world would switch to IPv6. There are enough IPv6 addresses to provide every machine with its own IP address. With no NAT you would lose the weak form of anonymity, but it would be easier to communicate peer to peer (in a secure way).

## What is hole punching?

Normally, when a someone sends a packet to your public IP (that is meant for your device) your NAT device will drop the packet. Your NAT device will *not* drop the packet when it already expects a packet that is meant for you. 

You can let your NAT know that it should expect a packet for you, by sending a packet yourself, to the exact same address that you will be expecting a packet from. This creates an entry in the connection table of your NAT, and for a certain amount of time (120 seconds for example) your NAT will forward incoming packets (from the exact address that you send a packet to) to you. If you will not get an answer in the set period of time the hole closes again, and you NAT will drop further packets.

So when client A and B behind NATs want to communicate peer to peer, they need to know:

- Client A and B would need to know each others public IP addresses
- Client A should know the port number that Client B will be expecting traffic on
- Client B should know the port number that Client A will be expecting traffic on
- Either client A or B should punch a hole through their NAT so a connection can be established 

This is a graphical representation how a packet would flow from client A to client B 

```
Client A: (192.168.1.1, 23456, 89.43.234.116, 55555) 
                            --->
       NAT A: (77.123.456.111, 23456, 89.43.234.116, 55555) 
                             |
                          internet
                             |
       NAT B: (89.43.234.116, 55555, 77.123.456.111, 23456) 
                           <---
Client B: (10.10.10.10, 55555, 192.168.1.1, 23456)

Definition of the tuple: (source IP, source port, destination IP, destination port)
```

Depending on the behavior of the NAT, hole punching will either almost always work, or almost always fail. Let's go through an example of both.


### An example when hole punching will almost always work

Let's go through a TCP example when hole punching will almost always work:

1. Client A sends a SYN to Public IP of client B: `(192.168.1.1, 23456, 89.43.234.116, 55555)`
2. NAT A changes the source IP of the packet: `(77.123.456.111, 23456, 89.43.234.116, 55555)`
3. Client A has punched a hole in NAT A.
NAT A creates the following entry in its connection table:

`120 TIME_WAIT SYN_SENT src=192.168.1.1 dst=89.43.234.116 sport=23456 dport=55555 [UNREPLIED] src=89.43.234.116 dst=77.123.456.111 sport=55555 dport=23456`

this lines tells you a SYN packet has been sent, for 120 seconds your NAT device will wait for an answer packet with these characteristics `(89.43.234.116, 55555, 77.123.456.111, 23456)`.
If a packet with these characteristics arrives NAT A will forward that packet to client A. If not the hole will be closed and NAT A won't forward the packet.

4. Client B sends a SYN to the public IP of client A: `(10.10.10.10, 55555, 192.168.1.1, 23456)`
5. NAT B changes the source IP of the packet: `(89.43.234.116, 55555, 77.123.456.111, 23456)`
6. The packet from client B will arrive at NAT A it matches the characteristics in the connection table of NAT A, NAT A forwards the packet the client A
7. Client A and B will continue the TCP handshake 
8. After the handshake the entry in the connection table of NAT A will be:
 
`431994 ESTABLISHED src=129.168.1.1 dst=89.43.234.116 sport=23456 dport=55555 src=89.43.234.116 dst=77.123.456.111 sport=55555 dport=23456 [ASSURED] mark=0 use=1`

Which indicates the connection is established, and will be alive for 431994 seconds!

In this example 2 clients are behind NATs devices that do not change the port numbers: *in this case hole punching will almost always work*. 


### An example when hole punching will almost never work

In this example 2 clients are behind NAT devices and NAT B changes the source port number. 
In this case hole punching will almost never work

1. Client A sends a SYN to Public IP of client B: `(192.168.1.1, 23456, 89.43.234.116, 55555)`
2. NAT A changes the source IP of the packet: `(77.123.456.111, 23456, 89.43.234.116, 55555)`
3. Client A has punched a hole in NAT A.
NAT A creates the following entry in its connection table:

`120 TIME_WAIT SYN_SENT src=192.168.1.1 dst=89.43.234.116 sport=23456 dport=55555 [UNREPLIED] src=89.43.234.116 dst=77.123.456.111 sport=55555 dport=23456`

4. Client B sends a SYN to the public IP of client A: `(10.10.10.10, 55555, 192.168.1.1, 23456)`
5. NAT B changes the source IP and the source port of the packet: `(89.43.234.116, 49873, 77.123.456.111, 23456)`
6. The packet from client B will arive at NAT A it does not match the correct characteristics because NAT B changed the source port, NAT A will drop the packet
7. A connection cannot be established

So, when does hole punching work? When both NAT devices do not change the source port numbers of the outgoing packages! Why? If the NAT of client A changes the source port number, client B does not know where to send the traffic to. Also, client A punched a hole through its NAT but its expecting traffic from client B with a different source port number, so client A will drop the packet from client B. If one of the 2 NATs changes the source port number, hole punching will fail.

In the literature NATs that change source port numbers are called symmetric NATs. 

*Note* When one of the two devices is not behind a NAT (even a NAT that changes source port numbers) no hole has to be punched and a connection can always be established (if there are no other firewalls of course). 



## How to simulate two clients behind NATs on a Linux machine 

This was the theory. The rest of the post go on about how you could replicate 2 clients behind NATs on your own machine. 

The basic idea is as follows:

1. Simulated 2 bridge networks (2 virtual switches)
2. On those 2 networks "plug in" 2 virtual machines (VM)
3. Configure one VM to be a NAT (router) and configure one VM to be a client 

I will cover:

- The creation of VMs with [libvirt](https://libvirt.org/docs.html)
- The configuration of bridge networks with [netplan](https://netplan.io/)
- How to configure the VMs so they will use the bridge networks
- The configuration of the IP addresses and routes with `iproute2`
- The configuration of a firewall for the client VMs with [`nftables`](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page)
- The configuration the NAT VM also with [`nftables`](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page)








