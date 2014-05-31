---
layout: post
title: "Day 05: Thinly Provisioned Snapshots"
date: 2014-05-28 22:54:34 -0400
comments: true
categories: lvm lvmthin snapshot rhel
---
In yesterday's post I introduced LVM snapshots and why they are useful. It may have gotten lost a bit in the jumble of comamnds. To recap, snapshots *physically* store only the differences between a filesystem at a given time and the present. Using the differences (which of course are much smaller than the entire filesystem) one can mount and reconstruct the filesystem from the point when the snapshot was created.

That, of course, is really cool, but let's say you want to take a TON of snapshots (like we're talking daily ones). The daily snaps would allow you to easily revert to what the filesystem looked like on a given day without using much more space. Of course, if they were just regular LVM snapshots, you'd need to decide on a size to give them. Taking daily snapshots in this manner would fill up in no time.

{% img center /deku-scrub/blag/images/uglydiagram.png %}

A thin pool is a logical volume. You give it a set size, and it is that size, much like a logical volume. The total amount of bytes cannot exceed that size ever, and if it does you'll have to resize it. Making one is as follows:

```
lvcreate --thinpool vg/thin_pool --size 30G
```

Where vg is the volume group. Nothing special *so far*. What's amazing though, is within this pool can exist filesystems that just **straight up lie** about how much space they have left. See the 100TB volume within the pool in the diagram above. You can mount that logical volume and it will appear to the computer as a 100TB volume. To create it within ```thin_pool```, issue the following commands:

```
lvcreate -T vg/thin_pool -V 100T -n big_filesystem
```

Note the use of the ```-V```  argument for virtual size. Why is this useful? It allows for the volume to dynamically take up space as it needs. Let's say you put 2GB worth of files on this "100TB filesystem." Physically, only 2GB worth of data will be **allocated**. Meaning, you can continue to create logical volumes within the pool that will expand up to their maximum virtual size. So this time, when we create our snapshots, their space doesn't matter! They will dynamically expand within the pool to the necessary size (which will be the size of the differences between them in the original). Obviously the [official documentation](https://access.redhat.com/site/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Logical_Volume_Manager_Administration/thinly-provisioned_snapshot_volumes.html) does a better job of explaining this, but I thought I'd give it a try.

```
lvcreate -s vg/big_filesystem -n snappy
```

Another added bonus of being within the pool is that the thin snapshots will share common data with *each other* too. This would have also been wasted duplicated space. These enhancements change the game of snapshots from a useful way to get a O(1) image of the filesystem to a meaningful way of storing the filesystem at any point and time.

QUICK CAVEAT. I got hung up on this for a long time. Thin snapshots have a special case when they are generated and are **not** automatically marked active to be mountable in ```/dev```. You can view this information using ```lvscan```. You will see any thin snapshots are marked inactive. Normally to mark a volume active, you'd simply perform:

```
lvconvert -ay vg/lv
```

However, as thin snapshots have the special flag set to not be marked active, you need to modify this to look like:

```
lvconvert -ay -K vg/lv
```

That simple ```-K``` argument drove me crazy for a bit. It was mentioned in the documentation, but I must have passed by it. As leaving ```-K``` out silently fails, I wasn't sure if my build of lvm2 was broken or what (as it would just not mark it active without telling me it failed). 

With this knowledge it is possible to easily create daily full snapshots of an entire filesystem without taking up any more space than would have been taken up by the difference bytes. The thin volumes will dynammically expand to fill the pool, so one does not have to worry at all about the sizes of the snapshots (in fact, you aren't allowed to set it for a thin snapshot). The [Gentoo Wiki](http://wiki.gentoo.org/wiki/LVM) actually has really good instructions and easy to follow commands on all of this if you don't want to take my word for them (or in the more likely case, if i've left something out).