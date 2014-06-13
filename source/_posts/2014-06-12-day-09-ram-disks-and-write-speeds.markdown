---
layout: post
title: "Day 09: RAM disks and Write Speeds"
date: 2014-06-03 19:31:20 -0400
comments: true
categories: lvm ramdisk dd
---
As discussed in yesterday's post, caching is beneficial when a large slow volume is assisted by a fast small one. While it isn't a practical use for production, my manager suggested I could emulate this faster behavior by using a ramdisk, as 2/3 of my machines don't have flash storage. A [RAM disk](http://en.wikipedia.org/wiki/RAM_drive), (which, from this point on, I shall continue going back and forth between "RAM disk" and "ramdisk" spellings) allows a piece of memory to be sectioned off and mounted like a disk would. This means it no longer performs it's RAM duties of storing memory, and the computer effectively treats your computer has having that much less RAM.

```
mkdir /mnt/ramdisk
mount -t tmpfs -o size=4096m tmpfs /mnt/ramdisk
```

Those commands will create a ramdisk on a linux system. [Mac instructions here](http://www.tekrevue.com/tip/how-to-create-a-4gbs-ram-disk-in-mac-os-x/). You can then test the write speed, and note how much faster the RAM disk reacts than your disk originally had.

```
# dd if=/dev/zero of=/mnt/ramdisk/disk.img bs=1m count=4096
4194304000 GB transferred in 4.0 GB/s
# dd if=/dev/zero of=~/disk.img bs=1m count=4000
4194304000 GB transferred in 300 MB/s
```

As seen there, the RAM is much faster. There are a couple of issues of course. The biggest one is when you reboot the ramdisk won't just be unmounted– it will be totally deleted. So you can't really rely on it for anything. In fact, the linux commands I listed above use [tmpfs](http://en.wikipedia.org/wiki/Tmpfs), which is designed to optimize things in such a situation.

There's another problem, though. I wanted to use the RAM disks as physical volumes on which to extend a volume group over to use it with lvmcache. AFAIK, the only way to do this is via a loopback device, as "mounting" the ramdisk doesn't actually count as a device in ```/dev```, which is required to create a physical volume.

```
losetup /mnt/ramdisk/disk.img /dev/loop1
```

And after this, it can be formatted as an LVM2 Physical Volume and added to the volume group.

```
pvcreate /dev/loop1
vgextend volume_group /dev/loop1
```

There is a caveat to this though, which has hurt me on a couple of occasions-- since the loopback device is temporary, once the computer reboots the physical device won't exist anymore. Normally that would mean the data on that device wouldn't be accessible, but as that device was part of a volume group, the volume group becomes inconsistent, and won't be able to be mounted until it is properly repaired.

To prevent this, prior to rebooting the following command needs to be executed:

```
vgreduce volume_group /dev/loop1
```

And the following command will attempt to backtrack you out of the situation where one forgets to do that prior to it, and needs to recover the volume group to access the logical volumes on it. Not that anyone would *ever* do that. 

```
vgreduce volumegroup --removemissing
```

(Yeah, I've more recorded these for myself to reference at a later date, so what.)
