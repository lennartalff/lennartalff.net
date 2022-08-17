---
title: Terraria Server
date: 2022-04-10
categories: ['Software']
tags: ['software', 'server']
---

## Get Your Stuff Together

Download the dedicated server from the [Terraria Wiki](https://terraria.fandom.com/wiki/Server). All information to start the server are provided there as well. The relevant steps here are to create a `serverconfig.txt` and we should not forget to forward the port used by Terraria. By default this is `7777`.

## Configure the systemd Daemon

These steps are heavily inspired by the [linode guide](https://www.linode.com/docs/guides/host-a-terraria-server-on-your-linode/).

Create the file `/usr/local/bin/terrariad`

~~~ sh

#!/usr/bin/env bash

SERVER_CMD_ARG="`printf \"$*\r\"`"
ATTACH_CMD_ARG="-r terraria"
SEND_CMD_ARG="-S terraria -X stuff $SERVER_CMD_ARG"

if [ "$1" = "attach" ]
then
    CMD_ARG="$ATTACH_CMD_ARG"
else
    CMD_ARG="$SEND_CMD_ARG"
fi

screen $CMD_ARG

~~~

We can attach to a running Terraria server via `terrariad attach` to interact with the server's command line. Or we can directly send server commands like `exit` to save the currently running Terraria world and stop the server via `terrariad exit`. 

Create the service file `/etc/systemd/system/terraria.service` and replace the paths and the username so they fit our setup.

~~~ ini

[Unit]
Description=server daemon for terraria

[Service]
Type=forking
User=root
KillMode=none
ExecStart=/usr/bin/screen -dmS terraria /bin/bash -c "/PATH/TO/THE/TerrariaServer.bin.x86_64 -config /PATH/TO/THE/SERVER/CONFIG/FILE/serverconfig.txt"
ExecStop=/usr/local/bin/terrariad exit
User=THE_USER_RUNNING_THE_SERVER
Group=THE_USER_RUNNING_THE_SERVER

[Install]
WantedBy=multi-user.target

~~~

That is almost it! Enable and start the service

~~~ sh

sudo systemctl enable --now terraria.service

~~~

