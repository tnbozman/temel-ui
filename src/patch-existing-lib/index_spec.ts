import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

import { addScriptsToPackageJson } from '.';

const collectionPath = path.join(__dirname, '../collection.json');

describe('patch-existing-lib', () => {
  let tree: UnitTestTree;
  const packageJsonPath = '/package.json';
  const appName = 'test-app';
  beforeEach(() => {
    tree = new UnitTestTree(Tree.empty()); // start with an empty tree

    // Add index.html to the tree with specified content
    tree.create(
      packageJsonPath,
      JSON.stringify({
        name: appName,
        scripts: {
          build: 'tsc -p tsconfig.json',
          test: 'ts-node node_modules/jasmine/bin/jasmine',
        },
      }),
    );
  });

  it('addScriptsToPackageJson', async () => {
    // arrange
    const expectedBuild = `ng build ${appName}`;
    const expectedBuildWatch = `ng build ${appName} --watch`;

    const resultTree = addScriptsToPackageJson(tree, appName);

    const result = resultTree.read(packageJsonPath);
    let json = JSON.parse(result!.toString());

    expect(json.scripts[`watch:${appName}`]).toEqual(expectedBuildWatch);
    expect(json.scripts[`build:${appName}`]).toEqual(expectedBuild);
  });

  it('works', async () => {
    // arrange
    const expectedBuild = `ng build ${appName}`;
    const expectedBuildWatch = `ng build ${appName} --watch`;

    const runner = new SchematicTestRunner('schematics', collectionPath);

    // act
    const testTree = await runner.runSchematic('patch-existing-lib', { project: appName }, tree);

    // assert
    const result = testTree.read(packageJsonPath);
    let json = JSON.parse(result!.toString());
    expect(json.scripts[`watch:${appName}`]).toEqual(expectedBuildWatch);
    expect(json.scripts[`build:${appName}`]).toEqual(expectedBuild);
  });
});
