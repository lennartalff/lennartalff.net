---
title: Raspberry Pi 4 and Arducam's OV9281 Global Shutter Camera
date: 2021-12-11
categories: ['Software']
tags: ["software", "raspberry pi", "camera", "ov9281", "raspi"]
---

# Why I prefer the official Kernel Module

At University I'm workin with small scale underwater robots. The vehicle estimates its position and orientation by applying a vision based pose estimation. Since there is not too much light in our test pool, we looked for an alternative to the official Raspberry Pi camera that uses an IMX219 image sensor. A more sensitive sensor allows for shorter exposure times and therefore minimizes motion blur. 

For roughly a year by now we have camera boards by Arducam in operation that are based on the OV9281 sensor. To be precise, these boards are exactly of the type shown in the figure below.

{{% rawhtml %}}
<figure>
    <img src="/images/ov9281_b0162.jpg" />
    <figcaption>Arducam B0162/UC-580 board with the OV9281 image sensor. Not compatible with the official OV9281 kernel module.</figcaption>
</figure>
{{% /rawhtml %}}

Arducam provides a closed-source library, and example code how to access the camera, on [GitHub](https://github.com/ArduCAM/MIPI_Camera). Actually there is not much wrong with using this library. At least if you don't mind that you are bound to Raspbian Buster (or Raspberry Pi OS as they call it now). Even a 64-bit version of the library is provided. So you can use the experimental 64-bit version of Raspbian that can be found in official [Raspberry Pi website](https://downloads.raspberrypi.org/raspios_arm64/images/). But there seem to be [problems](https://github.com/ArduCAM/MIPI_Camera/issues/106) with the 64-bit version of the Arducam library.

I prefer to have more freedom regarding the choice of the operating system I'm going to use. By using the kernel module it does not matter which OS you are using as long as you use a kernel with the corresponding kernel module activated. Hence it does not matter if you are going to use the Raspberry Pi OS or Ubuntu on the Raspberry Pi.

# Problems with Board Compatibility

The problem with the depicted B0162 board is that it is not compatible with the kernel module. This board has only a single data line but the kernel module expects two data lines. If you try to use the kernel module with the B0162 board though, you will recognize that a corresponding video device (e.g. `/dev/video0` most likely) will be created. But if you try to capture an image, you will not get any data.

However, the B0165 camera board in the figure below **is** working with the kernel module.

{{% rawhtml %}}
<figure>
    <img src="/images/ov9281_b0165.jpg" />
    <figcaption>Arducam B0165/UC-599 board with the OV9281 image sensor. Unlike the B0162 board this board is compatible with the official OV9281 kernel module.</figcaption>
</figure>
{{% /rawhtml %}}

Fortunately we had some laying around. What I didn't know when testing them: their lenses have an infrared-only filter. Since I don't want to limit the camera to infrared light, I removed the filter by dismounting the lense and sraping off the filter from the backside of the lense. I would not recommend to do so in general but to buy an OV9281 board with two data lines and an appropriate lense right away. Removing the filter increased the brightness -- as you would expect -- tremendously.

# TLDR

Make sure you have a camera board with two data lines to be compatible with the kernel module and add the device tree overlay.

Depending on whether you use Raspberry Pi OS or Ubuntu edit `/boot/config.txt` or `/boot/firmware/usercfg.txt` and add the following line

~~~ sh
dtoverlay=ov9281
~~~