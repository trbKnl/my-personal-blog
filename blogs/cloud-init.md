---
title: Local testing setup for Cloud-init
date: 2023-01-26
description: Test your Cloud-init configuration before deploying to the cloud
---

## At the bottom you can find the 2025-02 update of this article

<h2 class="border-bottom mb-3 mt-5">Goal of this blog post</h2>


In this blog post I will outline the steps you can take to create a local testing setup to initialize images with Cloud-init.

In this blog post you will learn something about:

- Cloud-init
- Running a virtual machine with qemu
- The qcow2 disk format

To follow along I assume you are on Linux and you are comfortable with installing software from your package manager.
If you don't have the commands I use, I assume you are able to install them yourself.


<h2 class="border-bottom mb-3 mt-5">Introduction to Cloud-init</h2>

What is Cloud-init? Clout-init is software that can be used to initialize images on first boot. The typical use case is as follows: you have an image that you need to deploy somewhere, and you need to apply some configurations: add users, install your public ssh key, install software, etc. Very useful stuff as almost everyone needs to do this. You only need to do it once by hand to realize its very tedious, error prone, and not replicable.
 
You can checkout the Cloud-init documentation [here](https://cloudinit.readthedocs.io/en/latest/).

<h2 class="border-bottom mb-3 mt-5">Why this blog post?</h2>

It can take some time to install an image on a virtual machine in the cloud. 
Whenever you are trying to create a Cloud-init config its too tedious to test this configuration directly into the cloud, it takes too long, and its much harder to debug when something goes wrong. 

I needed to deploy images to the cloud, and wanted to make sure my Cloud-init config did what it was supposed to. In blog post I will outline the steps I took.

<h2 class="border-bottom mb-3 mt-5">Start with a basic Cloud-init setup</h2>

To obtain a basic Cloud-init setup I followed the qemu [tutorial](https://cloudinit.readthedocs.io/en/latest/tutorial/qemu.html) on their website.
It boils down to these steps:

Create a test folder:

```
mkdir cloud-init-test-folder
cd cloud-init-test-folder
```

Download an image (with Cloud-init installed):

```
wget https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img
```

Create a yaml file called `user-data` containing the following:

```
#cloud-config
password: password
chpasswd:
  expire: False
```

This configuration changes the password of the default user (in this case the username is `ubuntu`) to password. 

Host your configurations using a simple http server:

```
python3 -m http.server --directory .
```

Start the vm with `qemu-system-x86_64` (qemu stands for quick emulator):

```
qemu-system-x86_64                          \                    
    -net nic                                \                    
    -net user                               \                    
    -machine accel=kvm:tcg                  \                    
    -cpu host                               \                    
    -m 512                                  \ # This gives you VM 512MiB of memory
    -nographic                              \ # Run in the terminal
    -hda jammy-server-cloudimg-amd64.img    \                    
    -smbios type=1,serial=ds='nocloud-net;s=http://10.0.2.2:8000/'
```

Log in with username: `ubuntu` and password: `password` to verify whether it worked. Press Control + a followed by x (`C-a x`) to kill the vm.


<h2 class="border-bottom mb-3 mt-5">The testing setup for Cloud-init I ended up using</h2>

The basic setup is not enough when you want to test properly i.e. you most likely want to install some software. 
I tried installing software using the above setup and immediately (not surprisingly) ran out of disk space.

That's when I realized (of course) you cannot install additional software on an `img` that is only the size of its contents.

This is where the [qcow2](https://en.wikipedia.org/wiki/Qcow) disk format comes in. 
The `qcow2` format is am image format that is resizable, and only takes up the amount it needs. 
Super useful for this particular use case.

What I did was the following:

1. Copy the downloaded image to a "fresh" image
2. Convert to image to `qcow2` format
3. Add a hypothetical 10GiB to the disk image, so you can install all the software you want

You can do that with these commands:

```
cp jammy-server-cloudimg-amd64.img fresh.img && 
qemu-img convert -O qcow2 fresh.img fresh.qcow2 && 
qemu-img resize fresh.qcow2 +10G
```

Each time you want to tryout a new Cloud-init configuration. You can run these commands again to obtain a fresh image.

I change the `user-data` to something a little more interesting (check the documentation for other, way more secure, example configurations).
This configuration configures a Jupyterhub server on first boot:

```
#cloud-config

# add admin user with password
# This is purely for demonstration
# Please configure something secure yourself
users:
  - default
  - name: admin
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    lock_passwd: false
    plain_text_passwd: password


# update and install packages
package_update: true
package_upgrade: true

# turn on ssh with password authentication
ssh_pwauth: true

# install jupyterhub and add an admin user
runcmd:
  - "curl -L https://tljh.jupyter.org/bootstrap.py | python3 - --admin admin:password"
```

Again, host your configurations with:

```
python3 -m http.server --directory .
```

Run with:

```
qemu-system-x86_64                           \                   
    -net nic                                 \                   
    -net user,hostfwd=tcp::10022-:22         \ # Configure ssh port to be 10022
    -machine accel=kvm:tcg                   \                   
    -cpu host                                \                   
    -m 2048                                  \ # Increase the memory to 2GB                  
    -nographic                               \                   
    -hda fresh.qcow2                         \                   
    -smbios type=1,serial=ds='nocloud-net;s=http://10.0.2.2:8000/'
```

Now you can ssh into your VM with password: `password`.

```
ssh admin@localhost -p 10022
```

Cool stuff! I ended up trying a whole lot of different configurations, so I was really happy that I took the time to figure out this setup.


<h2 class="border-bottom mb-3 mt-5">Tips and Tricks</h2>

Some Commands I found useful:

- Check the syntax of your `user-data` file with: `cloud-init schema --config-file user-data`
- Check whether cloud-init is finished running: `cloud-init status --wait`. This is especially useful when deploying in the actual cloud. Ssh into your VM and run that command and see whether Cloud-init is finished or still running.


## 2025-2 update

Using qemu directly can be a struggle, I don't really use qemu directly anymore, but I often vind myself creating VMs for testing. The following procedure uses virt-manager and is easier to use:


1. Create user-data file so cloud-init provisions the VM
2. Create the install image using the commands in the old article
2. `virt-install` the VM 
3. `virt-manager` to start the VM, or log into the console
4. Get the IP of the VM and login with ssh

### Step 1: Create `user-data`

```bash
#cloud-config

# user-data
# put whatever you need here
hostname: test
users:
  - name: turbo
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups: users, admin
    home: /home/myuser
    shell: /bin/bash
    ssh_authorized_keys:
      - ssh-rsa  your key
password: password
chpasswd: { expire: False }
ssh_pwauth: True
package_upgrade: true
```

###  Step 2: Create the install image

```bash
cp jammy-server-cloudimg-amd64.img fresh.img && 
qemu-img convert -O qcow2 fresh.img fresh.qcow2 && 
qemu-img resize fresh.qcow2 +10G
```

For the details read the original article

### Step 3: Install the VM using `virt-install`

```bash
virt-install \
  --name test \
  --memory 2048 \
  --vcpus 2 \
  --os-variant ubuntu22.04 \
  --network bridge=virbr0,model=virtio \
  --graphics none \
  --disk fresh.qcow2,format=qcow2,bus=virtio \
  --cloud-init user-data=user-data \
  --virt-type kvm \
  --noautoconsole
```

### Step 4: Open `virt-manager`

Check installation progress in `virt-manager`

### Step 5: Get IP of newly created VM 

`virsh net-dhcp-leases default`


### Step 6: Win

You won

