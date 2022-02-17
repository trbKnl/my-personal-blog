---
title: TCP and UDP holepunching through NAT devices
date: 2022-02-20
description: Learn to simulate a lab environment for testing purposes
---

### Goal of this blog post

I saw [this](https://www.youtube.com/watch?v=TiMeoQt3K4g) very insightful video from Engineer Man in which he explains UDP holepunching. The video is a great watch, and also a prerequisite for this blog.
I wanted to replicate his setup, but without renting virtual machine from a cloud provider. 
I don't want to go through that trouble and I want to have full control over all the parts involved in order to create an network environment that can be used for testing network applications. 
This blog post will show how to replicate the video of Engineer Man on your own machine.

The thing I initially set out to study was whether I could identify conditions when holepunching works and when it fails. 
You can find an answer to this question on the internet, but I was not really satisfied with those answers, so I present my own answer with detailed examples.

In this blog post you will learn:

- Conditions when holepunching does work
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


## Conditions when holepunching does and doesn't not work

NAT stands for network address translation, and for the rest of the blog I will use the word NAT to denote a device that does network address translation. In a typical home setup, the router that you got from your internet service provider (ISP) does network address translation. Why do we need a NAT? Because the internet still works mainly on IPv4 and there are only a limited number of IP addresses. To protect the number of IP addresses in the world we mostly operate behind NATs. You can have a lot of devices on your local network behind a NAT, but from the outside world traffic all seems to come from the same IP address.

This is a reason why its very hard to convict someone for pirating copyright material, because its hard to determine which exact device did the downloading. This is also the reason you cannot sent TCP/IP packets directly to your grandma PC. You can send packets to your grandma's public IP but you have no way of specifying to which actual device the packet should go to. Here is a picture with an example of two private networks behind NAT devices.

<p style="text-align:center;">
    <img src="/networksbehindNAT.svg" width="600">
</p>

You could argue that having a NAT device as a gateway to the internet is a form of weak protection. One cannot send packets directly to you, when you did not first initiate contact and provides a form of weak anonymity: was it you or your roommate that downloaded that movie?

The main problem with devices behind NATs is: how do you initiate contact with another peer behind a NAT? One solution could be: client B configures his NAT in such a way that all traffic on port 80 gets forwarded to his device (this is called "port forwarding"). Then he has a program listening on port 80 for incoming traffic and handles it accordingly. client A can send traffic to the public IP of client B to port 80, knowing that it will be forward to his device.

This solution works, but you have to configure port forwarding which is not very convenient and if client C (behind the same NAT as B) wants to talk to client A they have to negotiate another port number, because all incoming traffic on port 80 is being forwarded to client A already. 


### Holepunching with NATs that do not change source port numbers

In this example 2 clients are behind NATs devices that do not change the port numbers in this case holepunching will always work

This is a graphical representation how a packet would flow from client A to client B through 

```
Meaning of the tuple: (source ip, source port, destination ip, destination port)

Client A: (192.168.1.1, 23456, 89.43.234.116, 55555) 
                            --->
       NAT A: (77.123.456.111, 23456, 89.43.234.116, 55555) 
                             |
                          internet
                             |
       NAT B: (89.43.234.116, 55555, 77.123.456.111, 23456) 
                           <---
Client B: (10.10.10.10, 55555, 192.168.1.1, 23456)
```

1. Client A sends a SYN to Public IP of client B: (192.168.1.1, 23456, 89.43.234.116, 55555) 
2. NAT A changes the source ip of the packet: (77.123.456.111, 23456, 89.43.234.116, 55555) 
3. Client A has punched a hole in NAT A.
NAT A creates the following entry in its connection table:

120 TIME_WAIT SYN_SENT src=192.168.1.1 dst=89.43.234.116 sport=23456 dport=55555 [UNREPLIED] src=89.43.234.116 dst=77.123.456.111 sport=55555 dport=23456

this lines tells you a SYN packet has been sent, for 120 seconds your NAT device will wait for an answer packet with these characteristics (89.43.234.116, 55555, 77.123.456.111, 23456).
If a packet with these characteristics arives NAT A will forward that packet to client A. If not the hole will be closed and NAT A won't forward the packet.

4. Client B sends a SYN to the public IP of client A: (10.10.10.10, 55555, 192.168.1.1, 23456)
5. NAT B changes the source ip of the packet: (89.43.234.116, 55555, 77.123.456.111, 23456) 
6. The packet from client B will arive at NAT A it matches the characteristics in the connection table of NAT A, NAT A forwards the packet the client A
7. Client A and B will continue the TCP handshake 
8. After the handshake the entry in the connection table of NAT A will be:
 
431994 ESTABLISHED src=129.168.1.1 dst=89.43.234.116 sport=23456 dport=55555 src=89.43.234.116 dst=77.123.456.111 sport=55555 dport=23456 [ASSURED] mark=0 use=1

Which indicates the connection is established, and will be alive for 431994 seconds!


### Holepunching when one of the NATs changes the source port numbers

In this example 2 clients are behind NAT devies and NAT B changes the source port number. 
In this case holepunching will almost never work

1. Client A sends a SYN to Public IP of client B: (192.168.1.1, 23456, 89.43.234.116, 55555) 
2. NAT A changes the source ip of the packet: (77.123.456.111, 23456, 89.43.234.116, 55555) 
3. Client A has punched a hole in NAT A.
NAT A creates the following entry in its connection table:

120 TIME_WAIT SYN_SENT src=192.168.1.1 dst=89.43.234.116 sport=23456 dport=55555 [UNREPLIED] src=89.43.234.116 dst=77.123.456.111 sport=55555 dport=23456

4. Client B sends a SYN to the public IP of client A: (10.10.10.10, 55555, 192.168.1.1, 23456)
5. NAT B changes the source ip and the source port of the packet: (89.43.234.116, 49873, 77.123.456.111, 23456) 
6. The packet from client B will arive at NAT A it does not match the correct characteristics because NAT B changed the source port, NAT A will drop the packet
7. A connection cannot be established

When one of the two devices is not behind a NAT (even a NAT that changes source port numbers) no hole has to be punched and a connection can always be established (if there are no other firewalls of course). 








