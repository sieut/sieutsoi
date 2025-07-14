---
layout: post
title: "Homelab pains"
date: 2025-07-14 16:30:00 +0700
author: Sieu Tsoi
description: I thought this would be a fun side project at home
---

After a few rounds of upgrade to my personal PC, I was only missing an SSD and a fan to be able to throw together a homelab on consumer components. All the posts on r/homelab were very inspiring. I wanted a thing running 24/7 to do or serve whatever, even though I didn't know what just yet. Though I definitely did not foresee the struggles to come.

# Installing an OS

This should have been the easiest thing in the world. I've done this countless times. Plug the bootable USB in, press Enter, press Enter, press Enter, and voilà. Nope. Obstacle number one: The AMD 3700X *does not* have an iGPU 🙃 I cannot press Enter Enter Enter because I cannot plug a monitor into it and see what is going on!

This is but a minor deterrent! - I said.

I shall learn and do the coolest thing ever - [automated installation](https://pve.proxmox.com/wiki/Automated_Installation#Prepare_an_Installation_ISO). I read the doc, wrote the installation instructions, figured out how to automatically auto-install once the USB is booted, etc. But nothing was showing up, and I sat there dumbfounded as I realized: THERE IS NO WAY TO KNOW WHAT WENT WRONG!!! I don't have a monitor... (well, my hopeful-to-be homelab didn't)

Ok ok ok maybe I won't do the coolest thing ever then. Just the smart thing. I'll just plug the SSD into my PC, install an OS onto it, and plug it back to the homelab. Problem solved! First and second steps went swimmingly, I did this countless times, remember? But plugging it back to the homelab didn't work. My PC was upgraded to an AM5 CPU, which was the entire reason why I had all the parts to build a homelab. The upgrade from AM4 to AM5 required new motherboard and new RAM as well. OSes installed by an AM5 CPU don't work on an AM4 platform...

And so I had to resort to the worst thing ever - unplug the ginormous 4080 from my PC, put it in my homelab, *then* I would have access to the GUI to do the installation. As I was carrying out that plan, I realized that the homelab's tiny PSU may not have enough juice to power the freakin' 4080, and I'm afraid of the GPU breaking because of that, so I had to cook up this amalgamation of my PC's PSU powering the components of the homelab.

<style>
.image-caption {
    text-align: center;
    font-size: .8rem;
}
</style>

![](/assets/img/definitely-fire-hazard.jpg){: width="350" }
*This might be a fire hazard*
{:.image-caption}

P.S.: I later learned from my father, who is closer to being a real engineer than I am, that underpowered electrical devices may just be... underpowered? And that may not affect their life?

But hey, this did it. I had an OS on my homelab. I use [Proxmox](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview), btw. This fact will be relevant in the next section.

# Networking mares

It turned out you had to get real manual and dirty with networking on Proxmox. Like you have to actually touch a file in an alien location (`/etc/network/interfaces` - what the heck?)

Well actually, I had to because of my home network setup. I have mesh devices that are connected to a modem-and-router-in-one device from my ISP. The mesh devices have their own gateway, and the modem its own. When I was installing the OS, the homelab was plugged into a mesh device. But I wanted to set it up next to the modem, and be plugged into the modem.

If I were to just unplug and plug, it wouldn't work. I had to edit that weird file as well, because the DHCP range of the modem is different from the mesh devices', so the manual IP set during installation could not work. No big deal, I'll just change the address and certainly won't make a mistake. **I definitely did not put the fire-hazardy setup back to its non-fire-hazardy place either, because I may just need it again.**

So yea, it took ~~a few~~ only one try, and I got the networking going with the homelab connected to my modem.

# Sailing

That was back in 2024. The homelab was up and running without issues for a year. It is actually hosting this blog post right now! I also have Pihole on it for fun. And a dev environment where I work on my side projects.

Then the SSD was running out of space. I kept having to find things to delete in my dev environment. Oh well, it's time to upgrade. I don't even have to swap anything out, just plug a new NVMe in.

# Networking mares pt.2

So did you know consumer motherboards usually put the NVMe slots and the network interface card (NIC) on the same PCI lane? Oh what does that have to do with anything you may ask. Well, my NIC was named `enp5s0` with 1 NVMe SSD. But, my NIC was renamed to `enp6s0` with 2 NVMe SSDs. That is right. You didn't read it wrong. Your eyes didn't trick you.

From various occasions at work, I've learned that there always is a reason for why things are the way they are. **but what the fuck.**

Ok ok, no big deal <small>*\*knocks on wood*</small>. There is a way to hard-code the name of your NIC! There is [a section](https://pve.proxmox.com/wiki/Network_Configuration) about it in the docs. You can find the device by its MAC and rename it.

I asked Claude about it, and I even asked about testing it before applying the changes! So you know, I made the change, tested it, saw that things are probably gonna be OK, and rebooted my homelab. Anddddddd it **worked**, my homelab was connected to the network, and I could login and see how it was going. You didn't see that coming, did you? You thought this was when shit broke again. Haha no. I rebooted my homelab, and **this** was when shit broke. It didn't go online after the 2nd reboot.

So desperately, I had a long chat with Claude on how this could be salvaged. Claude was certainly... very agreeable (will probably write about this some day). Every whatabout I gave it was "*Absolutely!*" possible. But ok, after a bit of conversing, I can be convinced that this could be, 1/ a race condition, where the network interface was brought up before the name override happened, or 2/ a bandwidth issue with 2 SSDs, a NIC, and everything else that share the same PCI lane.

Well, if it was 1/, I can absolutely keep rebooting until I have connection again. I rebooted my homelab a few times, didn't change, so I rebooted a few more times, and I rebooted the modem as well, because we're reboot partying here, and at one point, it had connection! So I took out the name override, pointed my network interface to a device named `enp6s0`, double checked, took a deep breath, and rebooted. And then it never went online again. <small>haha.</small>

# Re-Installing an OS

I was kinda done at this point, some data loss is OK to me. So yea, after a year, I whipped out that abomination of a, well I can't even call it a setup, whatever. A rare opportunistic thought also convinced me to buy a dedicated NIC in case 2/ from above was true. So I did. Installed that new NIC into one of the two PCIe x1 slots, then installed Proxmox again. Did the whole dance of updating `/etc/network/interfaces` so I can connect the homelab to the modem. Booted it up to double check everything before putting the innards back into the case. At this point I didn't even exactly remember these steps after a whole year, I was kinda relieved that everything went OK.

Ok so I started assembling the machine into the case. I don't even know what to say. The case doesn't have an opening for the bottom PCIe x1 slot. Arghhhhhhhhh...

```
# A shitty diagram attempting to convey the situation I was in

 |
 |
[ ] -- -         # Top PCIe x1
[ ] -- --------  # A PCIe x16 for GPU
 |  -- -         # Bottom PCIe x1
 |________________________________
 ^ No opening for the LAN port
```


And oh I am so absolutely certain that if I install the NIC into the other x1 slot, the name is gonna change. But no worries, I had an idea.

```bash
#!/bin/sh
echo "----------------------" >> ~/ip.logs
date >> ~/ip.logs
ip link show >> ~/ip.logs
```

Put that in `crontab` with `@reboot command.sh`, and the script would print out the names of the NICs (I have 2 now, the onboard one and the new dedicated one). So idea: plug NIC into top slot, reboot, wait a few minutes, let the script run, then shutdown, plug NIC back into bottom slot, reboot, connect to host, check the output. This way, I'll know what the new name is, and I can update `/etc/network/interfaces` correctly.

This is literally the content of `ip.logs`

```
-------------------------------------
Sun Jul 13 05:23:22 PM +07 2025
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: enp5s0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc pfifo_fast master vmbr0 state DOWN mode DEFAULT group default qlen 1000
    link/ether 98:03:8e:a7:b4:4d brd ff:ff:ff:ff:ff:ff
3: enp7s0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 24:4b:fe:93:36:65 brd ff:ff:ff:ff:ff:ff
4: wlp6s0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether f8:ac:65:eb:34:a8 brd ff:ff:ff:ff:ff:ff
5: vmbr0: <BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state UP mode DEFAULT group default qlen 1000
    link/ether 98:03:8e:a7:b4:4d brd ff:ff:ff:ff:ff:ff
-------------------------------------
Sun Jul 13 05:27:12 PM +07 2025
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: enp6s0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc pfifo_fast master vmbr0 state DOWN mode DEFAULT group default qlen 1000
    link/ether 24:4b:fe:93:36:65 brd ff:ff:ff:ff:ff:ff
3: enp7s0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 98:03:8e:a7:b4:4d brd ff:ff:ff:ff:ff:ff
4: wlp5s0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether f8:ac:65:eb:34:a8 brd ff:ff:ff:ff:ff:ff
5: vmbr0: <BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state UP mode DEFAULT group default qlen 1000
    link/ether 24:4b:fe:93:36:65 brd ff:ff:ff:ff:ff:ff
```

Cool, `enp5s0` became `enp6s0`. I just need to point the `vmbr0` bridge to `enp6s0` instead of `enp5s0` in `/etc/network/interfaces`. Did that. Rebooted. Did not connect. Wait.

Did you see the cause in `ip.logs` before reading this line? Well here

```
-------------------------------------
2: enp5s0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc pfifo_fast master vmbr0 state DOWN mode DEFAULT group default qlen 1000
    link/ether 98:03:8e:a7:b4:4d brd ff:ff:ff:ff:ff:ff
                ^^^^^^^^^^^^^^^  # THE MAC OF THE NIC

3: enp7s0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 24:4b:fe:93:36:65 brd ff:ff:ff:ff:ff:ff
-------------------------------------
2: enp6s0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc pfifo_fast master vmbr0 state DOWN mode DEFAULT group default qlen 1000
    link/ether 24:4b:fe:93:36:65 brd ff:ff:ff:ff:ff:ff
                ^^^^^^^^^^^^^^^  # NO, THIS IS NOT THE NIC

3: enp7s0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 98:03:8e:a7:b4:4d brd ff:ff:ff:ff:ff:ff
                ^^^^^^^^^^^^^^^  # THIS IS THE NIC

```

Not only did it change the name of the dedicated NIC, but it also changed the name of the onboard NIC. What was once `enp7s0` was renamed to `enp6s0`, and the dedicated NIC became `enp7s0`.

From various occasions at work, I've learned that there always is a reason for why things are the way they are. **but SERIOUSLY WHAT THE FUCK.**

And no, I did not have the vast wisdom to copy `ip.logs` for the convenience of true debugging. In my last ditch effort, I really just went "well what the fuck, there are two ports, one doesn't work, what about the other?" And I was just really lucky that that was it.

# Closing Thoughts

None. Intellectual thinking has truly left me by this point. Bye.