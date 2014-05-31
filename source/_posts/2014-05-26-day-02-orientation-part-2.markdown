---
layout: post
title: "Day 02: Orientation Part 2"
date: 2014-05-22 02:24:20 -0400
comments: true
categories: nothing, lvm, fedora, rhel
---
The beginning of this day was some more regular boring orientation stuff. You know, all thsoe boring rules and what not. OH JUST KIDDING CHECK THIS JAZZ OUT:

{% img center /deku-scrub/blag/images/IMG_20140521_090618.jpg %}

They gave us these stickers, and this one left me confused. But don't worry, I texted it to my mom, and she was confused as well. I guess it's part of their "It's better to share - your mother was right" campaign. Also, this photo came out pretty nice so that is why you are currently looking at it. I can't say the same about the next one cause it's a little blurry.

{% img center /deku-scrub/blag/images/IMG_20140522_120209.jpg %}

Thar she blows in all her beauty. The specs are below in a neat little table that hopefully will come out and not look awful:

| Spec        | Value    |
| -----------------------|
| Processor   | i7-4600U 
| Memory      | 12GB     
| Storage     | 256GB    
| Resolution  | 1080p
| Battery     | two???

Yeah, it has two batteries for some reason which was very confusing at first. Well, that's all the good news, but the bad news is that I will have to return it at the end of the internship :(. My poor baby.

Here's where things get a little weird/interesting though: It turns out that, when they gave us the laptops, that they came installed with something called a "RHEL6 CSB", which is the "Red Hat Enterprise Linux Corporate Standard Build." Which actually, out of the box, does NOT have root or sudo access. Which, of course, means that you can't actually *install* anything. The person who gave us the laptops was very nice and expicilit in saying that we *could* in fact root them and install our own software on them, but I guess I was just taken aback.

{% img center /deku-scrub/blag/images/sandies.jpg %}

After receiving the laptops and being taught how to log into our @redhat.com accounts (we have to use an authenticator to do so, which is kind of annoying), we proceeded to the manager lunch. This consisted primarily of triangular sandwiches. During the lunch, my manager told me that I should probably just wipe whatever's on the machines and load up either a non-CSB of RHEL or Fedora. After lunch, I was escorted to my cubicle by my manager and then, surprisingly, left to myself.

I signed onto IRC and joined all the channels that my manager advised I hang out in, and then got to work on the laptop. My official instructions were to read up about lvm (logical volume management) partitions. In particular, I was to read the RHEL7 instructions that were in development and ensure that they were accurate to what actually happened. In this pursuit though, I began to notice something. I was unable to install any packages still, even despite having given myself root through recovery mode. Apparently Fedora and Red Hat binaries aren't actually compatible? And of course, to install anything that wasn't a binary I'd need a compiler but I couldn't fetch one of those either. Being a scrub, maybe one day I will figure out just what the problem was, but at the time I could not. 

I wasn't entirely comfortable with the idea of completely wiping the CSB they had just provided me with. It was custom configured to connect to the Red Hat VPN in Raleigh, among other things. To combat this, I opened up the disk utility to check out the feasability of a dual boot. Much to my surprise, the disk was split up like this: 3GB for /dev/sda1 (this was mounted as /boot, which AFAIK is about 2.8GB more than it needs to be?), 253GB for /dev/sda2. Okay, that's not the surprising part. The 253GB partition was a logical volume group encrypted with LUKS. Inside of this, however, was a rather odd setup: 8GB for /home, 30GB for a blank directory mounted as /VirtualMachines, 8GB for /, 4GB for swap. And that's it. 

Now, you may notice here, that 8+30+8+4 = 50GB / the 253GB partition. Where are the other 203GB? Unfortunately, the Disks utility wasn't telling me much, and gparted was telling me even less (no support for LUKS volumes). 

{% img center /deku-scrub/blag/images/Sad-pug.jpg %}

I was confused, but also conveniently had a list right next to me from my manager of lvm commands I could use to try to get to the bottom of the situation.

To list all the logical volumes (these are the things that are within the encrypted partition)
```
lvdisplay
```

And information regarding the aforementioned volumes appeared, including their volume group name. In this case, the volume group name was RHELCSB6, (configured by the CSB). 

```
lvcreate --size 30GB RHELCSB6
```

That's **it**. It was really confusing to see how simple this was via CLI, but how compicated and unrepresentable it was in the included GUI tools.

```
wget http://download.fedoraproject.org/pub/fedora/linux/releases/20/Live/x86_64/Fedora-Live-Desktop-x86_64-20-1.iso
dd if=Fedora-Live-Desktop-x86_64-20-1.iso of=/dev/sdc bs=500M
```

Where /dev/sdc is the usb device. The rest of the fedora process was straightforward, and the install also picked up the RHEL6 CSB install as long as it was mounted during the installation.

There's a lot that I haven't mentioned here, including fiddling around with ```lvremove```, ```vgdisplay```, ```lvrename```, and many more lv-, vg-, and pv tools. The way a lv (logical volume) builds on a vg (volume group) which builds on a pv (physical volume) seemed to, at least how I feel now, echo the networking stack, which is pretty interesting.