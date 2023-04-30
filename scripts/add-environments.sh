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

# display help message if -h is a commandline arg
help_message $help

echo "#################################"
echo "$starting: Adding environments to project $name"
echo "#################################"

if [[ ! -d $basePath ]]; then
  echo "$error: Root of the angular mono-repo cannot be found ($basePath)"
  exit 0
fi

cd $basePath

projectPath="./projects/$project/src";

# if the project has been successfully created lets customise it
if [[ ! -f "$projectPath/app/app.module.ts" ]]; then
  echo "$error: Project $name could not be found";
  exit 0;
fi

# added environment variables
cp -a ./templates/environments $projectPath
echo "$success: environments copied to project"
# update angular.json with production fileReplacements for env
updatedAngularJson="$(jq ".projects.$project.architect.build.configurations.production.fileReplacements += [{\"replace\": \"src/environments/environment.ts\",\"with\": \"src/environments/environment.prod.ts\"}]" ./angular.json)"
echo -E "${updatedAngularJson}" > angular.json
echo "$success: angular.json updated with production.fileReplacements for environments"

