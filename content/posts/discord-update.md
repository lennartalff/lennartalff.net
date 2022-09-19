---
title: Discord Update Blocks Launch
date: '2022-08-10'
categories: ['Software']
tags: ['software', 'fix']
---

If there is an update for `discord` available, the program will refuse to launch and give you the option to download the new version. Options available for Linux are `.deb` packages and archives with the source code. Since I'm using Arch Linux and `discord` is installed via `pacman` neither is a valid choice.
{{<highlight sh>}}
sudo vim /opt/discord/resources/build_info.json
{{</highlight>}}

``` json
{
    "releaseChannel": "stable",
    "version": "0.0.18"
}
```
