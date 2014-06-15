---
layout: post
title: "Day 11: Triple Threat"
date: 2014-06-05 19:32:13 -0400
comments: true
categories: lvm lvmthin ramdisk lvmcache
---
Much of my job consists of taking my computers... and destroying them. Well, I'm not supposed to be destroying them, and I'm not necessarily trying to either, but usually in testing LVM I manage to find one way or another to make the machines unbootable. Thankfully, due to the wealth of LVM information out there, more often than not I am capable of fixing the problems that develop on my laptop, but for the desktops it's usually just less effort to reformat them and try something different.

{% img center http://imgs.xkcd.com/comics/computer_problems.png %}

I was going to put in that [other xkcd](http://xkcd.com/349/) relating to computer problems, but this one seems more appropriate.

Now don't get me wrong, breaking the computers isn't necessarily *bad*. The actual problem is the fact that usually they break because of something that *I* do to them that's out of line. But then I learn so even that isn't a lose-lose situation. In reality, if I could find something that the user would expect to work according to the documentation that consistently (this being the key word here) breaks the machine, then I can create a bugzilla report from that. 

So today's big news was that I had all three computers down, and was gong back and forth between them all frantically trying to fix them. For the laptop that means making sure I can still boot to my fedora install–- this usually means fixing it from the rhel7 release candidate dual boot. For the other two computers, it's reformatting them and deciding on a new order / seeing what exactly went wrong during the latest install. Although Red Hat has a network boot system with a bunch of system installers on it, I usually find it easier to use my usb with rhel7 on it. 

I'm pretty picky with bugs, but I am surprised by how it can sometimes be very simple to break the boot order. That being said, I am practically playing with fire here with some of the commands that I run.

```
mkfs.ext4 /dev/mapper/vg-thinpool
```

The above command will format the thinpool and at first I was surprised that it worked, but in retrospect I don't know how it could be prevented. Upon running it my thin volumes that were within that pool seemed totally broken (and I can't say that I didn't expect them to be.)

Another caveat that frequently and still catches me is when I'm playing around with a ramdisk via loop back device as discussed a few posts ago. If one reboots without running ```vgreduce``` to remove the loopback device from the volume group, chaos usually ensues. 

When it's all said and done though, hopefully I can find some combination that people haven't accounted for that will destroy the systems. And until then, hopefully I can understand how and why the machine are actually breaking.