---
title: ESP32 Automatic Bootmode Selection
date: 2022-09-16
categories: ['Software']
tags: ['software', 'microcontroller', 'esp32']
figref: True
mathjax: True
---

Most ESP32 boards you can buy have a small circuit between the USB-Serial converter and the ESP32 itself to facilitate the procedure of writing new programs to the microcontroller. The general concept is that the ESP32 gets reset as soon as a serial connection will be created and the bootmode-selection pin gets pulled low to select the download-bootmode.

The reset circuit in {{< figref circuit >}} looks quite simple, doesn't it? In fact, getting it working gave me some headaches. In the end probably because I was sloppy with the wires and it had nothing to do with the overall procedure at all. Whatsoever, it made me investigate the procedure of auto-resetting and auto-bootmode-selection in detail.

{{< centerfigure id="circuit" src="/images/esp32-bootmode-circuit.png" width="50%" caption="The often used reset circuit to boot into the bootloader. This makes writing the a program to the flash memory possible without manual interaction." >}}

Actually, {{< figref circuit >}} shows only one half of the reset and bootmode-selection circuitry. But we stick with the first half for now. It might be useful to extend the picture a bit though. Let's imagine we have a USB-Serial-Converter to connect our computer to the ESP32. The converter will have Tx and Rx pins of course but it also has a (amongst others) a {{< overlinecode RTS >}} and a {{< overlinecode DTR >}} pin. Originally these were used for flow control with for example modems. `RTS` means Request to Send. This way the computer tells the modem it would like to send data. The modem would signal its readiness to receive data with the Clear to Send (`CTS`) signal. `DTR` stand for Data Terminal Ready. The purpose of this line is to signal the modem readyness of our computer.

Since we do not communicate with a modem, we do not care much about the original meaning of these signals. We just use the inverted `DTR` and `RTS` outputs of the USB-Serial-Converter to control the states of the `ENABLE` (sometimes also called {{< overlinecode RESET >}}) and the `GPIO0` pins. The following table displays the output states `EN` and `GPIO0` dependent on the inputs {{< overlinecode DTR >}} and {{< overlinecode RTS >}}. The parentheses indicate weak levels. The circuit in {{< figref circuit >}} is only able to pull the outputs low actively. Due to the fact, that the outputs are pulled high by internal or external pull-up resistors, we get defined output states. The x for `GPIO0` indicates that we do not care about its state while the `EN` pin is pulled low. Therefore the ESP32 is in reset state and the GPIO0 does not matter at all. But for the curious ones: it will be probably low during reset as we will see in a moment.
{{< table >}}
| State | !DTR | !RTS | EN | GPIO0 |
| ---- | ---- | ---- | ----- | ---- |
| 11 | 1 | 1 | (1) | (1) |
| 10 | 1 | 0 | 0 | x |
| 01 | 0 | 1 | (1) | 0 |
| 00 | 0 | 0 | (1) | (1) |
{{< /table >}}

So far so bad. Have you spotted the problem? Remember what we want to achieve? Reset the ESP32 and reboot in the download mode to write our program to the flash. This has to be done by following this sequence:
- Pull `EN` low
- Pull `GPIO0` low while releasing `EN`

And since **of course** we **do** read the f... manual, we know that `GPIO0` needs to be pulled down from at least the moment `EN` reaches `$ V_{IL\_\overline{RST}} = 0.6\,\text{V}$` for at least `$1\,\text{ms}$`. So a problem occures when we transition from state `10` to state `01`. Imagine we could switch {{< overlinecode RTS >}} and {{< overlinecode DTR >}} in no time. In this hypothetical case everything would be fine. The same moment the `EN` line goes high and enables the chip, the `GPIO0` line goes low and select the download boot mode. But in reality sometimes things are bad and in this case *bad* means, {{< overlinecode RTS >}} and {{< overlinecode DTR >}} will change their levels sequentially. It does not matter in which order we switch these lines. The transition order would bei `10 -> 11 -> 01` or `10 -> 00 -> 01` and state `00` and `11` both produce the same output, where the ESP32 is enabled but `GPIO0` is not pulled down to select the download boot mode.

Fortunately, the solution to this problem is quite simple. We place a capacitor between `EN` and `GND` in parallel to the pullup resistor. This RC-Circuit slows down the rise of the `EN` voltage level `$V_{EN}$` as follows `\[V_{EN}(t) = V_{\textrm{CC}}\left(1-e^{-\frac{t}{RC}}\right)\]` where `$V_{CC}$` is the supply voltage, `$R$` the resistance of the pull-up resistor and `$C$` the capacitance of the afore mentioned capacitor.

The procedure has been recorded with an oscilloscpe and is depicted in {{< figref plot >}}. As soon as the `esptool` script aquires the serial port, `RTS` and `DTR` are set to `true` which means {{< overlinecode RTS >}} and {{< overlinecode DTR >}} are `false` or low obviously. This point in time is marked as `$t_{\textrm{0}}$`. 

{{< plotly id="plot" src="esp32-bootmode-selection" caption="This is some caption" >}}

To reset the ESP32 the script executes the following code at `$t_{\textrm{1}}$`:

~~~ python
self._setDTR(False)  # IO0=HIGH
self._setRTS(True)  # EN=LOW, chip in reset
time.sleep(0.1)
~~~
The chip is held in reset state for `$100\,\textrm{ms}$`. Then the `esptool` toogles `DTR` and `RTS` sequentially at `$t_{\textrm{2}}$`

~~~ python
self._setDTR(True)  # IO0=LOW
self._setRTS(False)  # EN=HIGH, chip out of reset
time.sleep(delay) # delay=0.05
~~~

We can see, that the level of `EN` rises slowly with a very soft edge. This give the `esptool` enough time to make sure `GPIO0` is pulled down before the ESP32 starts to boot. Without the RC-Circuit `EN` would have a very steep edge at `$t_{\textrm{2}}$` and we would see a short high pulse in the `GPIO0` level in the upper plot in {{< figref plot >}}. This pulse would lead to the ESP32 selecting the normal and not the donwload bootmode.

At `$t_{\textrm{3}}$` `DTR` gets released as well, which means we finally end up with both {{< overlinecode RTS >}} and {{< overlinecode DTR >}} beeing high and both controlled transistors are in high impedance mode.

~~~ python
self._setDTR(False)  # IO0=HIGH, done
~~~
