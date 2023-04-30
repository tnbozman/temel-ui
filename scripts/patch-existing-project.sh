#!/bin/bash

empty="empty"
name=$empty
basePath="/workspaces/temel-ui"

# display help message if -h is a commandline arg
help_message() {
  if [[ $1 == "-h" ]]; then
    echo "Usage fix-existing-project.sh -p {project name}";
    echo "-p: Angular project to add environments to";
    echo "OPTIONS:"
    echo "-b Root of the angular mono-repo"
    exit 0
  fi
}

while getopts p:b:h flag
do
    case "${flag}" in
        p) name=${OPTARG};;
        b) basePath=${OPTARG};;
        h) help="-h";;
    esac
done

# display help message if -h is a commandline arg
help_message $help

if [[ ! -d $basePath ]]; then
  echo "$error: Root of the angular mono-repo cannot be found ($basePath)"
  exit 0
fi

cd $basePath

projectPath="./projects/$name/src";
appPath="$projectPath/app"

echo "#################################"
echo "$starting: Updating project $name"
echo "#################################"

# if the project has been successfully created lets customise it
if [[ ! -f "$appPath/app.module.ts" ]]; then
  echo "$error: Project $name could not be found";
  exit 0;
fi

# add material to the new projects app.modules
sed -i "/^@NgModule.*/i import { MaterialModules } from '../../../../material.modules'" $appPath/app.module.ts
sed -i "/imports.*/a MaterialModules," $appPath/app.module.ts
echo "$success: app.module.ts configured for MaterialModules"

# Add base layout and components
ng generate component layouts/default-layout --project=$name
cp $basePath/templates/default-layout.component.html $appPath/layouts/default-layout/default-layout.component.html
ng generate component pages/not-found-page --project=$name
ng generate component pages/landing-page --project=$name
echo "$success: base layout and components created"

# fix up the router
# need to skip if router not added
if [[ -f "$appPath/app-routing.module.ts" ]]; then
  mkdir $appPath/router
  rm $appPath/app-routing.module.ts
  cp -a ./templates/router/app-routing.module.txt $appPath/router/app-routing.module.ts
  cp -a ./templates/router/app.routes.txt $appPath/router/app.routes.ts
  # fix the app component for routing
  sed -i "s/app-routing.module/router\\/app-routing.module/" $appPath/app.module.ts
  echo "$success: router configured"
fi

# added environment variables
cp -a ./templates/environments $projectPath
echo "$success: environments copied to project"
# update angular.json with production fileReplacements for env
updatedAngularJson="$(jq ".projects.$name.architect.build.configurations.production.fileReplacements += [{\"replace\": \"src/environments/environment.ts\",\"with\": \"src/environments/environment.prod.ts\"}]" ./angular.json)"
echo -E "${updatedAngularJson}" > ./angular.json
echo "$success: angular.json updated with production.fileReplacements for environments"

# added serve a build to package json
updatedPackageJson="$(jq ".scripts += {\"serve:$name\": \"ng serve $name -o\"}" ./package.json)"
echo -E "${updatedPackageJson}" > ./package.json
updatedPackageJson="$(jq ".scripts += {\"build:$name\": \"ng build $name\"}" ./package.json)"
echo -E "${updatedPackageJson}" > ./package.json
echo "$success: package.json updated"
