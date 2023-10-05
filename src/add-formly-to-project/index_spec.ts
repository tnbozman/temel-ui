import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('add-formly-to-project', () => {
  let mockTree: UnitTestTree;
  const appName = 'test-app';
  const angularJsonPath = '/angular.json';
  const projectPath = `/projects/${appName}`;

  beforeEach(() => {
    mockTree = new UnitTestTree(Tree.empty()); // start with an empty tree
    mockTree.create(
      '/projects/test-project/src/app/app.module.ts',
      `import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`,
    ); // App module

    // Add index.html to the tree with specified content
    mockTree.create(
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

  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematic('add-formly-to-project', { project: appName, unitTest: true }, mockTree);

    expect(tree.files).toEqual([]);
  });
});
