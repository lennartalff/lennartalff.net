---
title: ZSH Autosuggestions Creates Duplicate Characters
date: 2022-06-28
categories: ['Software']
tags: ['software', 'fix']
---

I have noticed that sometimes the `zsh-autosuggestions` plugin repeats characters after using tab-completion. This happens when the locale environment variables are not set correctly (a detailed explanation can found [here](https://unix.stackexchange.com/a/90876)).

The environment variables can be set persistently in `/etc/default/locale` for Ubuntu systems. My setup looks like

~~~ sh
LANG=en_US.UTF-8
LC_TIME=de_DE.UTF-8
LC_MONETARY=de_DE.UTF-8
LC_PAPER=de_DE.UTF-8
~~~

For my Ubuntu server I realized that the settings in `/etc/default/locale` have been ignored. This can be avoided by setting `UsePAM yes` in `/etc/ssh/sshd_config`. For Debian this would be the default setting.