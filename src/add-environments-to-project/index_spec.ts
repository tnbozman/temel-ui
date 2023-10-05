import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('add-environments-to-project', () => {
  let tree: UnitTestTree;
  const appName = 'test-app';
  const projectPath = `/projects/${appName}`;
  const indexPath = `${projectPath}/src/index.html`;
  const indexContent = '<!DOCTYPE html>\n<html>\n<header>\n</header>\n<body>\n</body>\n</html>';
  const angularJsonPath = '/angular.json';

  beforeEach(() => {
    tree = new UnitTestTree(Tree.empty()); // start with an empty tree

    // Add index.html to the tree with specified content
    tree.create(indexPath, indexContent);
    tree.create(
      angularJsonPath,
      JSON.stringify({
        version: 1,
        projects: {
          'test-app': {
            root: projectPath,
            sourceRoot: `${projectPath}/src`,
          },
        },
      }),
    );
  });

  it('should contain index.html', () => {
    expect(tree.files).toContain(indexPath);
  });

  it('addEnvironmentsToProject', async () => {
    // arrange
    const runner = new SchematicTestRunner('schematics', collectionPath);
    // act
    const testTree = await runner.runSchematic('add-environments-to-project', { project: appName }, tree);
    // assert
    // test the correct file structure has been created
    const srcPath = `${projectPath}/src`;
    expect(testTree.files).toContain(`${srcPath}/environments/environment.ts`);
    expect(testTree.files).toContain(`${srcPath}/assets/env.js`);
    expect(testTree.files).toContain(`${srcPath}/assets/env.template.js`);

    // test that the script tag exists in index.html
    const buffer = testTree.read(indexPath);
    const content = buffer!.toString();
    expect(content).toContain('<script src="env.js"></script>');
  });
});
