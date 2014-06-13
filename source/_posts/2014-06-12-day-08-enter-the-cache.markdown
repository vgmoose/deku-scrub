---
layout: post
title: "Day 08: Enter the Cache"
date: 2014-06-02 18:24:45 -0400
comments: true
categories: lvm lvmcache cache
---
Logical volumes are very unique in the sense that you can inject some higher level logic into something as low level as the bytes on your disk. Flash disks are very fast, but large ones are also still very expensive. This obviously creates an interesting problem for server maintainers, as ideally large amount of content would be served as fast as possible which would require the best of both worlds. 

{% img center /deku-scrub/blag/images/cash.gif %}

Not.. that kind of cash. Ha. HA HA. [dm-cache](http://en.wikipedia.org/wiki/Dm-cache) was a proprosed kernel module solution to allow quick access to frequently used blocks from a large slow disk using a quick fast disk. As of [April 28, 2013](https://www.kernel.org/doc/Documentation/device-mapper/cache.txt) it is now officially a part of the Linux kernel. The Wiki article does a better job of explaining, as usual, but dm-cache helps speed up a slow device by storing only the modified blocks to the fast device and marking the slow device as dirty, allowing full reads and writes to occur solely off the cache. For this reason, it is recommended that the caching device be [mirrored](http://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_1).

LVM cache, from my understanding, provides an easy approach to allow the user to configure this through LVM by making use of the dm-cache module. At its heart, lvmcache requires an original, large and slow logical volume, and then a smaller but fast logical volume. A third logical volume is also utilized for metadata storage, not unlike how a thinpool stores its metadata.

An odd tidbit about lvmcache, though, is that the logical volumes that are utilized must all be within the same volume group. To review, a physical volume (like an actual primary partition of a device or another device entirely) can only be within one volume group at a time, and the volume group provides an abstraction over those physical devices to the logical volumes. Or at least that's what I thought.

```
lvcreate -n isolated -L 10G volume_group /dev/sdb1
```

Yeah, so apparently you can pass a physical volume to the logical volume creation command and it will ensure that all writes go to that device. At least, that's my understanding of it. I'm not entirely sure how you'd enforce say, a 10G logical volume, if you tied it to a 4G device, and I really don't enjoy how it breaches the abstraction provided by the volume group. 

Addtionally I can't seem to be able to figure out just *where* these devices are listed (they aren't listed in ```lvdisplay```). The process can also be simplified by using tags, which I do know how to display. 

```
lvs -o+tags
```

But unfortunately, I don't know much else about them. I believe though that they provide some abstraction that was desired previously with the bypassing of the volume group. [Here is more information](http://rwmj.wordpress.com/2014/05/30/lvm-cache-contd-tip-using-tags/) on that.

