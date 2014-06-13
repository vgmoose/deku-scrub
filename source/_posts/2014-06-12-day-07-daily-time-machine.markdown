---
layout: post
title: "Day 07: Daily Time Machine"
date: 2014-05-30 22:17:38 -0400
comments: true
categories: lvm lvmthin snapshot cron
---
Happy Friday! I finally feel like I'm becoming well-versed with these LVM commands. I'm also starting to feel a lot more comfortable in general. It might just be because we're using Thinkpads, but this laptop has byfar been the most comfortable linux experience I've had to date. There are still very minor things that are preventing me from using it all the time (some as major as the trackpad being awful, and some as minor as the default gnome drop shadow size) but it is all around very pleasant. Maybe I'm being brainwashed by Red Hat, but I'm also probably gonna swap out my home server with Fedora instead of Debian.

But that's ALL besides the point. Today I set up a cool thing which I shall now share with you now.

```
# lvs

  LV            VG    Attr       LSize  Pool    Origin Data%  Meta%
  homey         purin Vwi-aotz--  1.00t thinset          2.24     
  ...
  snap05.30.14e purin Vwi---tz-k  1.00t thinset homey             
  snap05.30.14m purin Vwi---tz-k  1.00t thinset homey             
  snap06.01.14e purin Vwi---tz-k  1.00t thinset homey             
  thinset       purin twi-a-tz-- 50.00g                 47.15  25.06
```

Here you can see that I have a 50G lvm thin pool called "thinset" (at the bottom), and within this pool is a logical thin volume called "homey". Then there are three snapshots that use "homey" as their origin, meaning they are a snapshot of "homey," and will copy the required bytes on write to maintain their snapshot state.

What ISN'T shown here is that I currently have the "homey" LV mounted at ```/home```

```
# df -h

Filesystem               Size  Used Avail Use% Mounted on
/dev/mapper/purin-homey 1008G  6.0G  951G   1% /home
```

There are the usual interesting things about lvmthin volumes that you can note here, such as ```df``` believing the filesystem only has 1% of its "1008G" used, when in reality the thin pool only has 50G that it is able to allocated. But you can also see that I have snapshots of the form ```snapMM.DD.YY(e/m)```, which are taken daily on that date (with e for evening and m for morning). This was configured via ```cron``` by editing ```/etc/crontab``` to have the following new lines appended:

```
  0  10 *  *  * root       lvcreate -s purin/homey -n snap$(date +\%m.\%d.\%y)m
  0  17 *  *  * root       lvcreate -s purin/homey -n snap$(date +\%m.\%d.\%y)e
```

Making my snapshot commands being run on the 10th (10AM) and 17th (5PM) hours of each day. It's also worth noting that ```anacron``` could be used if I wanted to queue up the snapshots for when the computer was powered down, but that isn't desired behavior, at least not for me.

You might be thinking to yourself "Okay who cares about cron what does that really have to do with your internship?" To which I respond it's just cool, okay?! SHARING IS CARING.

Some more things to note here is that I did have to create the "homey" LV from nothing and manually copy over my files from my old ```/home```. This is due to the fact that I needed it to be within a thin pool, and you can only take thin snapshots of an external origin (LV that isn't within a thin pool) when that source is read-only. I thought I'd just start it all over.

```
lvconvert --merge purin/snapMM.DD.YYz
```

The above command can be run (when ```/home``` isn't mounted) to rollback to the given snapshot day. I've tested it a little bit so far and it has been successful, but it should get a lot more interesting once I have a bunch of snapshots to go off. If one tries to ```lvconvert``` while the origin is mounted, the merge will be queued until the next mount of the <strong>snapshot</strong>. This actually took me a while to learn. And don't forget, to activate a thin snapshot one needs to pass the ```-K``` flag as mentioned in an earlier blog post.

I have a couple more questions in my head about this mysterious, magical snapshot process. The big ones are: What happens to garbage files, like if I were to run ```dd if=/dev/zero of=file.out bs=4k count=5000000```? Would the resulting 10G file be kept around in the thinpool? And if so, how could that easily be detached from all the snapshots? And another question is, in the output from ```lvs``` above, why is the data percent so high? I am not using 2% of 1T, as seen in ```df``` my home directory is only 6G, and 2% of 1T is 20G. Is that *because* I ran commands similar to that ```dd``` one? Not that I *did*.

I have a feeling Monday's post is going to involve ram disks and dm-cache, so stay tuned and try not to fall off the edge of your seat.
