# Angular Schematics

## install 

```sh
npm install -g @angular-devkit/schematics-cli
```

## Create Schematic Project

```sh
schematics blank --name=temel
```

## setup unit testing with jasmine

### install dev dependencies

```sh
npm install jasmine ts-node --save-dev
```

### initialise jasmine

```sh
npx jasmine init
```

Make sure your jasmine.json is set up correctly to include your test files

```json
{
  "spec_dir": "src",
  "spec_files": [
    "**/*[sS]pec.ts"
  ],
  "helpers": [],
  "stopSpecOnExpectationFailure": false,
  "random": false
}
```

### Update your package.json:

Add a script to run your tests. For TypeScript, you'll need to use ts-node with Jasmine:

```json

{
  "scripts": {
    "test": "ts-node node_modules/jasmine/bin/jasmine"
  }
  // ... rest of your package.json
}
```

### Run your tests:

Execute the test script:

```bash
npm test
```

This will compile your TypeScript tests on-the-fly with ts-node and then run them using Jasmine.


## Rearrange

As I couldn't get the schematic project to scaffold into the base directory lets clean up

```sh
cp -R ./temel/* ./
rm -rf ./temel
rm -rf ./src/temel
npm install
```

change ./src/collection.json to
```json
{
  "$schema": "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
  }
}
```

## Schematics

### add-environments-to-project

```sh
schematics blank --name=add-environments-to-project
```

#### add templates

```sh
mkdir ./src/add-environments-to-project/files/src/environments
mkdir ./src/add-environments-to-project/files/src/assets

cat > ./src/add-environments-to-project/files/src/environments/environments.ts << EOL
export const environment = {
  production: false
};
EOL 

cat > ./src/add-environments-to-project/files/src/assets/env.js << EOL
(function(window) {
    window["env"] = window["env"] || {};
    window["env"]["production"] = false;
})(this);
EOL 

cat > ./src/add-environments-to-project/files/src/assets/env.template.js << EOL
// https://pumpingco.de/blog/environment-variables-angular-docker/
(function(window) {
    window["env"] = window["env"] || {};
    window["env"]["production"] = true;
})(this);
EOL 
```

### patch-existing-lib
```sh
schematics blank --name=patch-existing-lib
```

### patch-existing-project

```sh
schematics blank --name=patch-existing-project
```


# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with

```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
