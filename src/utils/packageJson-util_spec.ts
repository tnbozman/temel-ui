import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { addScriptsToPackageJson } from './packageJson-util';
import { ProjectType } from './enums/project-type.enum';

describe('addScriptsToPackageJson', () => {
  let tree: UnitTestTree;

  beforeEach(() => {
    tree = new UnitTestTree(Tree.empty());
    tree.create(
      '/package.json',
      JSON.stringify({
        scripts: {},
      }),
    );
  });

  it('should add build and watch scripts for the specified library to package.json', () => {
    const projectName = 'test-project';
    const updatedTree = addScriptsToPackageJson(tree, projectName, ProjectType.LIB);
    const packageJson = JSON.parse(updatedTree.readText('/package.json'));

    expect(packageJson.scripts[`watch:${projectName}`]).toBe(`ng build ${projectName} --watch`);
    expect(packageJson.scripts[`build:${projectName}`]).toBe(`ng build ${projectName}`);
  });

  it('should add build and watch scripts for the specified project to package.json', () => {
    const projectName = 'test-project';
    const updatedTree = addScriptsToPackageJson(tree, projectName, ProjectType.APP);
    const packageJson = JSON.parse(updatedTree.readText('/package.json'));

    expect(packageJson.scripts[`serve:${projectName}`]).toBe(`ng serve ${projectName} -o`);
    expect(packageJson.scripts[`build:${projectName}`]).toBe(`ng build ${projectName}`);
  });

  it('should throw an error if package.json is not present', () => {
    tree.delete('/package.json');
    const projectName = 'test-project';
    expect(() => addScriptsToPackageJson(tree, projectName, ProjectType.LIB)).toThrowError(
      /Could not read package.json/,
    );
  });
});
