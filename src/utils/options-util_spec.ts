import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { SchematicsException } from '@angular-devkit/schematics';
import { setupOptions } from './options-util';

describe('options-util', () => {
  let tree: UnitTestTree;
  const appName = 'test-app';
  const projectPath = `/projects/${appName}`;
  const angularJsonPath = '/angular.json';

  beforeEach(() => {
    tree = new UnitTestTree(Tree.empty()); // start with an empty tree

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
      new SchematicsException('Invalid project name: non-existent-project'),
    );
  });
});
