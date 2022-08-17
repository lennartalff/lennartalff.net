---
title: Restore the Linux Bootlaofter after a BIOS Update
date: 2022-06-28
categories: ['Software']
tags: ['software', 'linux']
---

## What is the Problem?

Probably only a boot variable has been lost. In my working setup the output of

``` sh
efibootmgr -v
```

looks like 

``` sh {linenos=inline}
BootCurrent: 0002
Timeout: 1 seconds
BootOrder: 0002,0000,0001
Boot0000* Windows Boot Manager  HD(1,GPT,82b6086d-efe1-45bd-9610-0bd97b8d1dfb,0x800,0x32000)/File(\EFI\MICROSOFT\BOOT\BOOTMGFW.EFI)WINDOWS.........x...B.C.D.O.B.J.E.C.T.=.{.9.d.e.a.8.6.2.c.-.5.c.d.d.-.4.e.7.0.-.a.c.c.1.-.f.3.2.b.3.4.4.d.4.7.9.5.}...a................
Boot0001* UEFI: SanDisk, Partition 1    PciRoot(0x0)/Pci(0x8,0x1)/Pci(0x0,0x3)/USB(6,0)/HD(1,MBR,0x134f5,0x800,0x729b800)..BO
Boot0002* Linux Boot Manager    HD(1,GPT,82b6086d-efe1-45bd-9610-0bd97b8d1dfb,0x800,0x32000)/File(\EFI\SYSTEMD\SYSTEMD-BOOTX64.EFI)
```

Line 3 shows the bootloader and entry 0002 has the highest priority. The corresponding entry can be seen in line 6. In my case BIOS updates remove this entry, so my system is not able to use the Linux Boot Manager anymore and directly boots into Windows.

## Preparations

Since I'm using Arch Linux I prefer to create a bootable USB-Stick with Arch installed. Probably other distros would work as well.

We mount the EFI partition. We have to take care of the correct device name. In my case it is `/dev/nvme0n1`, but it might be of the kind `/dev/sdX` as well.

~~~ sh
mount /dev/nvme0n1p1 /boot
~~~

## Creating the Missing Entry

~~~ sh
efibootmgr --create --disk /dev/nvme0n1 --loader '\EFI\systemd\systemd-bootx64.efi' --label 'Linux Boot Manager' --verbose
~~~

<p class="notice--info"><strong>Attention: </strong> We specify the whole disc, not a specific partition!</p>

## Configure the Boot Order

We can either do this in our BIOS settings or by using `efibootmgr` again. In my case from the output of `efibootmgr -v` above, the order would be

~~~ sh
efibootmgr -o 2,0,1
~~~

## Alternative Way
One could also just backup the content of the EFI partition, reinstall the the boot manager via `bootctl install` and restore the backup.