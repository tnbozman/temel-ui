import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { SchematicsException } from '@angular-devkit/schematics';
import * as path from 'path';


import { setupOptions } from '.';

const collectionPath = path.join(__dirname, '../collection.json');

describe('add-environments-to-project', () => {
  let tree: UnitTestTree;
  const appName = 'test-app';
  const projectPath = `/projects/${appName}`;
  const indexPath = `${projectPath}/src/index.html`;
  const indexContent = '<!DOCTYPE html>\n<html>\n<header>\n</header>\n<body>\n</body>\n</html>';
  const angularJsonPath = '/angular.json';

  beforeEach(() => {
    tree = new UnitTestTree(Tree.empty());  // start with an empty tree

    // Add index.html to the tree with specified content
    tree.create(indexPath, indexContent);
    tree.create(angularJsonPath, JSON.stringify({
      version: 1,
      projects: {
        'test-app': {
          root: projectPath,
          sourceRoot: `${projectPath}/src`,
        }
      }
    }));
  });

  it('should contain index.html', () => {
    expect(tree.files).toContain(indexPath);
  });

  it('should set the default project if none is provided in options', async () => {
    // arrange
    const options: any = {};
    // act
    await setupOptions(tree, options);
    // assert
    expect(options.project).toBe(appName);
  });

  it('should throw an error for an invalid project name', async () => {
    // arrange
    const options = { project: 'non-existent-project' };
    // act/assert
    await expectAsync(setupOptions(tree, options)).toBeRejectedWith(
      new SchematicsException('Invalid project name: non-existent-project')
    );
  });

  it('addEnvironmentsToProject', async () => {
    // arrange
    const runner = new SchematicTestRunner('schematics', collectionPath);
    // act
    const testTree = await runner.runSchematic('add-environments-to-project', {}, tree);
    // assert
    // test the correct file structure has been created
    const srcPath = `${projectPath}/src`;
    expect(testTree.files).toContain(`${srcPath}/environments/environment.ts`);
    expect(testTree.files).toContain(`${srcPath}/assets/env.js`);
    expect(testTree.files).toContain(`${srcPath}/assets/env.template.js`);

    // test that the script tag exists in index.html
    const buffer = testTree.read(indexPath)
    const content = buffer!.toString();
    expect(content).toContain('<script src="env.js"></script>');
  });
});