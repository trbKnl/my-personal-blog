---
title: Raspberry Pi cluster with Kubernetes
date: 2021-13-08
description: How to build your own Raspberry Pi cluster with Kubernetes
---

<p style="text-align:center;">
    <img src="/cluster.png" width="600">
</p>

<style type="text/css">
td {
    padding:0 15px;
}
pre {
    background-color: lightgray;
}
</style>


<h3 class="border-bottom mb-3 mt-5" id="goal-of-this-blog-post">Goal of this blog post</h3>

In this blog post I will talk about the things you need to setup your own Raspberry Pi cluster: from the hardware you need to the techniques you will probably have to use.

Topics I will discuss:
- Hardware needed to setup your own cluster 
- How you could prepare your Raspberry Pi's 
- How to install a flavour of Kubernetes (k3s) on your Pi's 
- An example of a workload you can run
- Further learning you can do

After this blog post you will have a general idea on how to start building your cluster and you know what to pay attention to. To follow along and understand what I am talking about, a little familiarity with Linux and the command line will help. To use your Raspberry Pi cluster comfortably, you will need a device with Linux, Mac OSX or Windows with Windows subsytem for Linux (I haven't checked that one out yet), and access to a terminal.

<h2 class="border-bottom mb-3 mt-5" id="Introduction">Hardware for the cluster</h2>

You absolutely do not need to build an underpowered Raspberry Pi cluster, but it is still a lot of fun to do so! And its a great learning experience. The main inspiration to build my own cluster is [Jeff Geerling](https://www.youtube.com/c/JeffGeerling) he has a ton of cool video's on Raspberry Pi's, so check him out if you are interested in that. From his website I got the gist of what parts I needed.

I ended up buying:

- 4x Raspberry Pi 4B's with 4 GiB of RAM
- 4x Power over Ethernet (PoE) hats for the Raspberry Pi, these are modules you can put onto the Pi so you can power them with the Ethernet port
- 4x micro sd cards to put the OS on, I used slow ones with 16 GiB of storage. For your cluster, buy fast ones, with a little more capacity. 
- 1x A PoE switch with 4 PoE ports and 1 normal port, this is a switch that can power devices through Ethernet
- 5x Small Ethernet cables that can also handle power
- 1x Housing for the Raspberry Pi's so you can stack them nicely on top of each other
- 1x power adapter for the Raspberry Pi 4, in case you want to power one not using the switch
- 1x male-male micro HDMI to HDMI cable, so you can hook your Pi up to a screen if needed.
- 1x A very small USB drive for external storage (Samsung Fit Plus USB 128GiB)
- micro sd to sd adapter (in my case it was included in the micro sd card purchase), I need this adapter to plug the micro sd cards into my laptop

I forgot what it cost exactly, it was somewhere between 550 and 650 euro's. Not super cheap, but also not that expensive. You could definitely substitute all the Raspberry Pi's for old hardware you have lying around, but it won't be cutesy and small anymore, and it will consume more power. Remember that these things will be always on, power consumption is more of an issue then. 


<h2 class="border-bottom mb-3 mt-5" id="Introduction">Put an OS on your micro sd card</h2>

The first step is putting the OS's for the Pi's on the micro sd cards. I think most arm operating systems will work. I used Debian for arm architecture. Make sure that the architecture of the operating system matches that of your Pi. You can use a program such as `dd` to put the OS on the micro sd cards. 

*Important*: you will need to configure your Pi's each having a different unique hostname and a different static IP-address. 

I used HypriotOS as my OS of choice with their included install script (which uses `dd`, the last post they made on their website is from 2019 so you want to use something more recent). The nice thing about HypriotOS was/is, is that it comes with [cloud-init](https://cloud-init.io/). After you have installed the OS on the micro sd cards, you can put files in the `/boot` directory, when booting up the Pi headless (no screen attached) the cloud-init software will read these files, and configures: hostnames, IP's, and a users with ssh access. The files that you need to put in the `/boot` directory are:

- network-config: a text file containing network information. In this file you can specify a static IP that the machine should use. This is needed so that you and other devices can always find your machine on your internal network. A static IP won't change on you.
- user-data: a text file containing user data, you can configure a user, and configure ssh keys, so you can directly ssh into that machine. 

Search the web for more information and for example configs and change those to your needs. I found cloud-init really handy, I would definitely use an image with something like cloud-init again. The important thing to remember here is that it is possible to configure the Pi to your needs upon first boot. You might think: "I have to do it only once, I don't care". That is fine, but you will probably mess up at some point and you want to do a reinstall. I had to reinstall a couple of times, and was happy that I did not have to do the configuring again. 

If you are not using cloud-init you will have to do the setup manually (edit `/etc/hosts` to configure the hostname and static IP, and manually setup ssh. These things are useful to know, and chances are you will have to configure them at some point manually anyway).

Also you have to have an ssh service running on boot (so you can ssh from your dev machine into the Pi from first boot on), if not, you should go into that machine install ssh on it if needed and start and enable the ssh service with [systemd](https://wiki.archlinux.org/title/Systemd). Most distro's use systemd: as the init system and system services manager. Knowing the absolute bare minimum greatly helps, that is:

- `sudo systemctl` ; See what services are running 
- `sudo systemctl start blabla.service` ; Starts
- `sudo systemctl stop blabla.service` ; Stops
- `sudo systemctl restart blabla.service` ; Restarts
- `sudo systemctl status blabla.service` ; Checks the status
- `sudo systemctl enable blabla.service` ; Makes it so the service starts on boot, next time you reboot

Systemctl stands for "system control", and all the commands do what you think they do. I rarely use something else besides these commands. As a side note: I think most systems with cloud init will probably have an ssh service enabled by default, but who knows.

So with the Pi's configured and plugged in, your home network might look something like this:

<p style="text-align:center;">
    <img src="/network.png" width="600">
</p>


<h2 class="border-bottom mb-3 mt-5" id="Introduction">Install k3s on your cluster</h2>

With your cluster up and running you can install a flavour of [Kubernetes](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/) on it. Kubernetes is a cluster manager, that manages containerized workloads. So with it you could manage your containerized workloads, those workload can be anything: a webserver, a database, a web app, etc! Very cool stuff.
Kubernetes can be a little too much at first, I would definitely recommend doing some selfstudy, I did the following: 

- I watched a Kubernetes course from Nigel Poulton on pluralsight, which I can recommend. 
- Download and install Minikube to try out single node kubernetes locally
- Read the introduction on the Kubernetes website

With a basic understanding of Kubernetes, can you install it on a Pi cluster. I chose k3s (a Kubernetes distrubution) for my cluster, because I saw people had tutorials on it (the main reason, hehe), it is lightweight, and suitable for arm devices. 

The installation of k3s is one of the simplest things ever, just follow these [instruction](https://rancher.com/docs/k3s/latest/en/quick-start/).

On your master node do this:
```
$ curl -sfL https://get.k3s.io | sh - 
```
On your worker nodes do this:
```
$ curl -sfL https://get.k3s.io | K3S_URL=https://hostname-of-your-master-node:6443 K3S_TOKEN=mynodetoken sh -
```
The instructions read: "The value to use for K3S\_TOKEN is stored at /var/lib/rancher/k3s/server/node-token on your server node."

You now have an up and running k3s cluster! 

<h2 class="border-bottom mb-3 mt-5" id="Introduction">How to start playing with your cluster</h2>

The main way to interact with your cluster is with the `kubectl` "kube control" command. You want to install this on your development machine, and make it so that you can use it to connect from your dev machine to your cluster. That way you do not have to ssh into your Pi each time you want to issue a command to the cluster.

To connect `kubectl` on you dev machine to the cluster, follow these [instructions](https://rancher.com/docs/k3s/latest/en/cluster-access/), for the lazy:
"Copy /etc/rancher/k3s/k3s.yaml on your machine located outside the cluster as ~/.kube/config. Then replace “localhost” with the IP or name of your K3s server. kubectl can now manage your K3s cluster."

Kubectl is easy to use and to remember, because the syntax of the commands are well structured.

To get you started:
- `kubectl cluster-info`
- `kubectl help`

To do basic stuff:
- `kubectl get pods`
- `kubectl get pods --all-namespaces`
- `kubectl describe pod <name-of-specific-pod>`
- `kubectl delete pod <name-of-specific-pod>`
- `kubectl apply -f <name-of-file-that-contains-the-resource-definition-you-want-to-apply-to-your-cluster-pod>.yaml`

Almost all commands work like you expect them to, which is super nice. In general you can do this:
`kubectl <action> <resource> <resource-name>` To view all the resources on your cluster do: `kubectl api-resources`. 


<h2 class="border-bottom mb-3 mt-5" id="Introduction">Deploying a pod</h2>

In order the deploy a containerized workload you can submit a yaml file, describing the desired state of your cluster. Kubernetes will try to match your desired state, to the actual state of the cluster and it tries to match that. So for example: you desire 1 pod, currently the cluster has 0 pods, kubernetes will do anything to get to and maintain the desired state of 1 pod.

You can submit workloads/pods/desired states described in yaml files to the clustering using `kubectl`. Here is an example of a yaml file you can apply to your cluster with: `kubectl apply -f <nginx-example.yaml>`

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: basic-nginx-deployment
  labels:
    app: basic-nginx-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app:  basic-nginx
  template:
    metadata:
      labels:
        app: basic-nginx # label of your pod, this will be used to identify the pods
    spec:
      containers:
      - name: website-deployment
        # Kubernetes will download the image from the default registry, probably dockerhub
        # In case you want to use your own container, point "image:" to an image on a registry you own
        # such as, my.registry.com/my-cool-image:latest
        image: nginx 
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: basic-nginx-service
spec:
  # The NodePort service type will make the app it is pointing to (in this case basic-nginx) available from outside the cluster
  # To reach the app do: http://<hostname-of-node-on-your-cluster>:<nodePort-number-in-this-case-30007>
  type: NodePort 
  selector:
    app: basic-nginx # This service will target all pods with label: "app: basic-nginx"
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30007
```

This example submits a [deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) and a [service](https://kubernetes.io/docs/concepts/services-networking/service/) to the cluster.
The deployment controls what kind of container you want in your pod, and how many pods you want. The services exposes the pod to traffic outside the cluster. The services and the pods know about each other because of labels and selectors.

After you have applied this yaml, check what its doing to the cluster:

- `kubectl get pods --watch` 
- `kubectl describe pods <name-of-your-nginx-pod>`
- `kubectl get service` 
- `kubectl get deployments` 
- `kubectl describe service` 
- You can try to get a [shell](https://kubernetes.io/docs/tasks/debug-application-cluster/get-shell-running-container/) into the nginx pod

If everything went well you can access the nginx webserver at http://\<hostname-of-machine-in-cluster\>:30007.
To delete all the resources you just created, do: `kubectl delete -f <nginx-example.yaml>`


<h2 class="border-bottom mb-3 mt-5" id="Introduction">Further reading</h2>

In order to get a fully functional cluster with bells and whistles, I followed most instructions on: [carpie.net](https://carpie.net/). He has excellent self contained tutorials on how to setup and configure a k3s cluster. Cool things he talks about are: how to setup your own private registry for your own images, and how you can expose your apps to the internet.

Also the YouTube channel [just me and opensource](https://www.youtube.com/channel/UC6VkhPuCCwR_kG0GExjoozg) has a ton of useful content.

If you want to learn Kubernetes but are not willing to buy hardware, you can:

- Install it on virtual machines.
- Try out Minikube

If you want to maintain your cluster not having to ssh into them all the time, you can try out [Ansible](https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html). I am using it to update the software on my cluster every once in a while, I am definitely going to check it out some more.

If you are tired of using `kubectl` you can try out [k9s](https://github.com/derailed/k9s), a UI that lets you interact with a k8s cluster it works well and looks super good. Check it out.
