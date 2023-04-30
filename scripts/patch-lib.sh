#!/bin/bash

empty="empty"
project=$empty
basePath="/workspaces/temel-ui"
success="SUCCESS"
error="ERROR"
starting="STARTING"

# display help message if -h is a commandline arg
help_message() {
  if [[ $1 == "-h" ]]; then
    echo "Usage add-environments.sh -p {project name}";
    echo "-p: Angular project to add environments to";
    echo "OPTIONS:"
    echo "-b Root of the angular mono-repo"
    exit 0
  fi
}

while getopts p:b:h flag
do
    case "${flag}" in
        p) project=${OPTARG};;
        b) basePath=${OPTARG};;
        h) help="-h";;
    esac
done

cd $basePath

# add build scripts to package.json
updatedPackageJson="$(jq ".scripts += {\"watch:$project\": \"ng build $project --watch\"}" ./package.json)"
echo -E "${updatedPackageJson}" > ./package.json
updatedPackageJson="$(jq ".scripts += {\"build:$project\": \"ng build $project\"}" ./package.json)"
echo -E "${updatedPackageJson}" > ./package.json
echo "$success: package.json updated"
