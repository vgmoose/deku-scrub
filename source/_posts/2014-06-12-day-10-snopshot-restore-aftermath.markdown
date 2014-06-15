---
layout: post
title: "Day 10: Snapshot Restore Aftermath"
date: 2014-06-04 19:31:40 -0400
comments: true
categories: lvm lvmthin snapshot
---
So today I thought I'd through caution to the wind and just restore one of the daily snapshots that I had lying around from the cron job. This turned out to be not such a great idea... Despite being in charge of reviewing the documentation, it was not so obvious to me that upon merging one of the snapshots from my "Time Machine" the other ones would be de-linked as snapshots, and simply exist as thin volumes within the pool. This is pretty upsetting, as the inability to merge the snapshots that I have diminishes their value... Or so I thought.

You see, as it turns out, and as I probably should have realized, merging thin snapshots isn't the only way to restore one of these snapshots. Since at a lower level device mapper is taking care of the bytes within the thin pool, I can simply rename the snapshot I want to restore's thin volume to my current one and swap them. As I've been backing up my home directory, I'll obviously have to do this either as root or from another volume, but such was the case with merging as well.

```
lvrename vg/cur_home old_home
lvrename vg/snap_to_restore cur_home
```

In addition to that, the skip automatic activation flags should be set up accordingly, and at the very least the new home volume should have it turned off. This is that weird ```-k``` stuff.

```
lvchange -kn vg/cur_home
lvchange -ky vg/old_home
```

And then on the next reboot all was well... With the exception of ```lvs``` looking a bit messier now (as you can tell when a point has been restored from by looking at the origins).

{% img center /deku-scrub/blag/images/IMG_20140604_162029.jpg %}

In other news, I've received another monitor. Still only one mouse and keyboard, but swapping those isn't nearly as tedious as swapping monitors, so that's pretty useful. Above is my current setup, and below are more pics.

{% img center /deku-scrub/blag/images/IMG_20140604_162037.jpg %}

Here's desk space here if I ever need to write anything down. I was considering splaying some papers there to make it look like it was in use, but that would be weird.

{% img center /deku-scrub/blag/images/IMG_20140604_162042.jpg %}

I'd move the other one to the floor, but until I get an extension cord moving the first one isn't much of an option. This bottom one is the one with the removable hard disks, so in retrospect perhaps I should have left it on the desk instead of having to lean down to remove a disk.
