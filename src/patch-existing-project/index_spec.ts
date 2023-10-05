import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('patch-existing-project', () => {
  const appName = 'test-project';
  const projectPath = `/projects/${appName}`;
  const indexPath = `${projectPath}/src/index.html`;
  const indexContent = '<!DOCTYPE html>\n<html>\n<header>\n</header>\n<body>\n</body>\n</html>';

  let mockTree: Tree;

  beforeEach(() => {
    mockTree = new UnitTestTree(Tree.empty());
    // Add index.html to the tree with specified content
    mockTree.create(indexPath, indexContent);
    // Mock the basic structure of an Angular project
    mockTree.create(
      '/angular.json',
      JSON.stringify({
        version: 1,
        projects: { 'test-project': { root: projectPath, sourceRoot: `${projectPath}/src` } },
      }),
    ); // Angular workspace config
    mockTree.create(
      '/package.json',
      JSON.stringify({
        scripts: {},
      }),
    );
    mockTree.create('/projects/test-project/tsconfig.app.json', '{}'); // App specific tsconfig
    mockTree.create('/projects/test-project/src/main.ts', ``); // Entry file

    mockTree.create('/projects/test-project/src/app/app.module.ts', `import { NgModule } from '@angular/core';`); // App module
  });

  it('test with routing', async () => {
    mockTree.create(
      '/projects/test-project/src/app/app-routing.module.ts',
      'import { RouterModule } from "@angular/router";',
    ); // Routing module
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematic('patch-existing-project', { project: appName, unitTest: true }, mockTree);

    // Check if MaterialModules has been added
    const content = tree.readContent('/projects/test-project/src/app/app.module.ts');
    expect(content).toContain("import { MaterialModules } from '../../../../material.modules'");

    // Check if app-routing.module.ts was deleted
    expect(tree.exists('/projects/test-project/src/app/app-routing.module.ts')).toBeFalse();
    expect(tree.exists('/projects/test-project/src/app/router/app-routing.module.ts')).toBeTrue();
    expect(tree.exists('/projects/test-project/src/app/router/app.routes.ts')).toBeTrue();
    // Check if new components are created
    // This will vary based on how your schematic is configured. The following is an example.
    expect(
      tree.exists('/projects/test-project/src/app/layouts/default-layout/default-layout.component.html'),
    ).toBeTrue();

    // test environments added
    expect(tree.exists('/projects/test-project/src/assets/env.js')).toBeTrue();
    expect(tree.exists('/projects/test-project/src/assets/env.template.js')).toBeTrue();
    expect(tree.exists('/projects/test-project/src/environments/environment.ts')).toBeTrue();

    // couldn't test the externalSchematics for '@schematics/angular' component as they don't effect the tree
  });

  it('test without routing', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematic('patch-existing-project', { project: appName, unitTest: true }, mockTree);

    // Check if MaterialModules has been added
    const content = tree.readContent('/projects/test-project/src/app/app.module.ts');
    expect(content).toContain("import { MaterialModules } from '../../../../material.modules'");

    // Check if app-routing.module.ts was deleted
    expect(tree.exists('/projects/test-project/src/app/app-routing.module.ts')).toBeFalse();
    expect(tree.exists('/projects/test-project/src/app/router/app-routing.module.ts')).toBeFalse();

    // Check if new components are created
    // This will vary based on how your schematic is configured. The following is an example.
    expect(
      tree.exists('/projects/test-project/src/app/layouts/default-layout/default-layout.component.html'),
    ).toBeTrue();

    // test environments added
    expect(tree.exists('/projects/test-project/src/assets/env.js')).toBeTrue();
    expect(tree.exists('/projects/test-project/src/assets/env.template.js')).toBeTrue();
    expect(tree.exists('/projects/test-project/src/environments/environment.ts')).toBeTrue();

    // couldn't test the externalSchematics for '@schematics/angular' component as they don't effect the tree
  });
});
