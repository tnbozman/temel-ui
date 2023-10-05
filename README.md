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
  "spec_files": ["**/*[sS]pec.ts"],
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

## setup ESLint and Prettier

Absolutely! Transitioning from TSLint to ESLint is a good decision since TSLint is now deprecated. Let's migrate your Angular project to use ESLint alongside Prettier.

### 1. Installation:

#### ESLint:

First, you'll want to install the required ESLint dependencies:

```bash
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
```

#### Angular ESLint:

To integrate ESLint with Angular, you can use the Angular-specific ESLint configs and plugins:

```bash
npm install @angular-eslint/eslint-plugin @angular-eslint/eslint-plugin-template @angular-eslint/template-parser --save-dev
```

### 2. Setting up the Configuration:

#### ESLint:

Create a `.eslintrc.json` file in the root of your project:

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "@angular-eslint", "prettier"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@angular-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "prettier/prettier": ["error"]
  }
}
```

### 3. Integrate with Prettier:

First, install the required dependencies:

```bash
npm install prettier eslint-config-prettier eslint-plugin-prettier --save-dev
```

Add `.prettierrc` configuration file:

```json
{
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "bracketSpacing": true
}
```

### 4. Replace TSLint with ESLint in Angular (For Ng Projects, not Schematic Projects):

Angular projects generated with the Angular CLI still default to using TSLint. However, there's a schematic available called `@angular-eslint/schematics` that can convert TSLint settings to ESLint:

1. Install the schematic:

```bash
npm install @angular-eslint/schematics
```

2. Run the conversion:

```bash
ng add @angular-eslint/schematics
ng g @angular-eslint/schematics:convert-tslint-to-eslint YOUR_PROJECT_NAME
```

Replace `YOUR_PROJECT_NAME` with the name of your Angular project.

### 5. VSCode Integration:

#### Extensions:

Make sure to install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for VSCode.

#### Configuration:

Add .vscode/settings.json with the following settings to your project

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": ["typescript"]
}
```

This ensures that ESLint runs in conjunction with Prettier when you format your TypeScript files.

### 6. (Optional) Remove TSLint:

Since TSLint is deprecated, you can choose to uninstall it:

```bash
npm uninstall tslint
```

You might also want to delete `tslint.json` if it's no longer required.

---

Now, your Angular project should be set up with ESLint and Prettier for best practices, and VSCode should lint and format your TypeScript files on save!

## Setup TypeDoc

To generate TypeScript documentation using the comments you've written, you'll need to use a tool like `TypeDoc`.

`TypeDoc` converts comments in TypeScript source code into rendered HTML documentation or a JSON model. It supports Markdown and includes a set of themes.

Here's how to set it up:

### 1. Installation:

Install TypeDoc in your project using npm:

```bash
npm install --save-dev typedoc
```

### 3. Configuration:

You can also create a `typedoc.json` configuration file in your project root to specify options. For example:

```json
{
  "entryPoints": ["./src"],
  "entryPointStrategy": "expand",
  "out": "./docs",
  "theme": "default"
}
```

This is helpful if you have a lot of options or if you want to standardize documentation generation across multiple projects.

### 4. Use in NPM Scripts:

You can add a script to your `package.json` to make it easier to generate docs:

```json
"scripts": {
  "docs": "typedoc"
}
```

With this script, you can simply run:

```bash
npm run docs
```

This will generate the documentation using the options specified in `typedoc.json`.

### 5. Inspecting the Output:

Once the documentation is generated, open the `index.html` file located inside the output directory (e.g., `./docs`) in your web browser to view the documentation.

Remember to write your TypeScript comments using the [JSDoc](https://jsdoc.app/) format, as this is the format `TypeDoc` and many other documentation generators expect. Your provided comments are already in the appropriate format.

### 5. Serving docs locally (Optional):

You can install `http-server` as a development dependency in your project. This ensures that other developers working on the same project can easily serve the documentation without needing to install `http-server` globally on their machines.

Here's how to do it:

#### 1. **Install `http-server` as a dev dependency**:

```bash
npm install http-server --save-dev
```

2. **Add a script in `package.json`**:

You can add a script to your `package.json` file to serve the documentation using the locally installed `http-server`:

```json
"scripts": {
  "serve-docs": "http-server ./docs"
}
```

3. **Run the script**:

After setting up the script, you can serve your documentation by running:

```bash
npm run serve-docs
```

By installing `http-server` as a development dependency, you keep your project's setup more self-contained and ensure that other team members or contributors have all the necessary tools for the project just by running `npm install`.

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
  "schematics": {}
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

### add-formly-to-project

```sh
schematics blank --name=add-formly-to-project
```

### add-golden-layout-to-project

```sh
schematics blank --name=add-golden-layout-to-project
```

### add-mfe-project

```sh
schematics blank --name=add-mfe-project
```

### mono-repo-project

```sh
schematics blank --name=mono-repo-project
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
