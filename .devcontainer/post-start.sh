#!/bin/bash

# copy the user git config from the volume mount to the host machine
cp /vscode/gitconfig-temp $HOME/.gitconfig
chown $USER: $HOME/.gitconfig
git config --global --add safe.directory /workspace



