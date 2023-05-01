#!/bin/bash

# copy user ssh profile to the devcontainer from the volume mount to the host machine
cp -RT /vscode/ssh $HOME/.ssh
chown $USER: -R $HOME/.ssh
