---
layout: post
title: "Day 03: Cubicle Sweet Cubicle"
date: 2014-05-23 04:06:11 -0400
comments: true
categories: lvm rhel raid
---
This was the first "real" work day here, without any intern specific activities, and also a Friday. When I arrived and parked in a spot in the back of the building, with my new babby laptop in tow, I really, for a brief moment, felt like a functioning member of society. I heroically scanned into the building using my incredibly and extremely fancy spider-man web-launcher style security card, only to become INSTANTLY lost in the maze that was the building. After eventually making my way to the Cube (and making a stop for a bagel in the break room)

Don't worry your sweet eyes shall not be disappointed by today's entry, for I have MORE PICTURES.

{% img center /deku-scrub/blag/images/IMG_20140523_112111.jpg %}

My manager met with me briefly before the day started to let me know that he would be sending me a couple of more resources on lvm and the like. He also dropped off not one, but two old desktop computers. We're talking like, 128MB ram on these pups. OH MAN I JUST REMEMBERED SOMETHING THAT NEEDS TO BE TALKED ABOUT NOW AND NOT LATER.

{% img center /deku-scrub/blag/images/500004774-03-01.jpeg %}

I went inside one of these server rooms yesterday and they are *really cool*. Also very loud. But I was shocked that they actually looked like this! Each rack has many shelves, and each shelf has a server. Then there are SO MANY of those racks. There were wires everywhere and fans running (hence the noise) for cooling. It was some SERIOUS business. It really gave me a sense of just what "scalability" means and why it's so important. Like, there were a LOT of computers here.

Okay, but those computers were nothing in comparison to my dinosaurs. Here are the specs, again in convenient table format. 

[coming soon, I don't actually have those specs on hand right now. Gist-wise though, one had two 750GB drives, the other one 500GB drive]

{% img center /deku-scrub/blag/images/IMG_20140523_112117.jpg %}

The computers had some RHEL installs on them setup with virtual machines, but as per my manager's request, I pushed all of those aside and performed a fresh install of RHEL6. When doing this, I was also (obviously) allowed to select the way the disks looked. For the machine with two drives, I settled on the following layout: 

Drive 1: 200mb /boot, remaining space RAID member 2
Drive 2: full RAID member 2

RAID: one logical volume group

volume group: 10GB logical volume for /, 4GB swap, 50GB logical volume for /home

You might think that's all boring, but it (should mean) that anything at all that happens to any of the volumes within the volume group would be completely synced across drives. That is, if one drive were to fail completely, all of the data would remain intact.

Due to the fact that it's between only two drives, that makes it just a simple RAID1 setup. Regardless, I put it to the test. While it was booted, I had a file open. I then ripped out one of the drives (as they are removable), performed a write, put the drive back in, waited for them to sync, and then ripped out the other one. Sure enough, the system was completely unaffected, as it should have been.

{% img center /deku-scrub/blag/images/chickensandwich.jpg %}

What this blog REALLY needs is more pictures of food. Lunch (cost money...) but was also pretty good. I had pretty much the above. The remainder of the day was spent reading up on some lvm docs that are totally confidential. [Just kidding](/deku-scrub/blag/images/nope.txt). But really, it wasn't all that interesting. What was pretty cool though, was later installing the RHEL7 release candidate on a new logical volume on my laptop. That's also confidential though. [OH ALSO JUST KIDDING. AGAIN](/deku-scrub/blag/images/nope.txt).

Not sure where this is going again. I've lost perspective. Also scope. Last thing I'd talk about is there's a package called ```system-storage-manager``` which is a pretty neat, (but still CLI) program to interface with lvm without needing to get down and dirty with lvm commands.

Yes, that is what I leave you with.