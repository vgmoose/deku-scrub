---
layout: post
title: "Day 12: Kernel Upgrading and Reinstallation"
date: 2014-06-06 19:32:48 -0400
comments: true
categories: lvm kernel yum lvmcache grub
---
The toolset ```lvmcache``` is special in that it isn't supported in the default kernel that ships with Fedora 20. My RHEL7 machines (and partition on my laptop) have no issues using it, but it would be most useful to have functioning on my laptop. After a lot of researching I learned that it eventually boiled down to the version of the linux kernel that I was using.

```
uname -r 
```

The above command reports information about the kernel. I was running 3.11, which does not have [dm-cache](https://github.com/mingzhao/dm-cache) support. The README lists instructions on how to compile the kernel module, but I had mixed results. My knowledge of how a kernel is actually compiled is severly limited given my previous userland background, but that didn't mean that I wasn't ready to give it my all. The short explanation is that it may not have been as simple as the instructions made it out to be. The long explanation is that I spent a long time downloading various kernel sources and headers  trying to recompile and add this module to the kernel.

The process is all very official and streamlined, but it still gave me some issues. For that reason, I am choosing *not* to include the instructions here, for fear that someone else will build upon my mistakes. After I finally seemed to have everything functioning, I didn't actually know how to "activate" it. When flashing kernels on Android, it's always fairly obvious. I mean, you usually just go to recovery and literally flash it. There's no concept of multiple kernels or anything.

```
sudo yum update kernel
```

It should be noted here that, prior to deciding to jump in and compile my own kernel, I had tried the simple above command. When I first typed it, I thought I was an idiot, it couldn't be so simple. Once it actually started to download and install kernel 3.14 though, I then felt very satisfied. Upon rebooting though, the kernel still wasn't activated. Well, to get back to my own compiled kernel, the case was the same for that. Neither the updated kernel from yum nor my own custom kernel seemed to be activated.

I'm not sure if I missed something along the lines, and I was getting increasingly frustrated, so I performed a reinstall of Fedora 20. As you know, my home directory is on another partition, so all of my data and preferences were still intact. Still though, my kernel refused to update. Then it hit me, and things started to click into place. The whole manner in which my system functions is it loads a kernel into ram from a /boot physical partition selected via grub, and this kernel then mounts and loads the filesystem and all its contents. 

Well, as it turned out that was an oversimplication. It would seem that the grub bootloader entries actually contain information about the kernel that is being used at boot. Unlike the Android model where you can flash and only use one at a time, it would seem the kernels are almost hot swappable via grub. I should have expected such functionality. 

```
grub2-mkconfig -o /boot/grub/grub.cfg
```

So as it turned out, getting grub to re-run the OS scanner and reconfigure itself allowed it to pick up both kernels, and 3.11 and 3.14 are both selectable at boot time. Such fine grained control should have been expected. I'm a little surprised that I had never come across this in any of my kernel building tutorials, but I should probably blame myself for not having ran a real multi-boot linux machine in a long time.