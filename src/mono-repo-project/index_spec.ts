import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('mono-repo-project', () => {
  const appName = 'test-app';
  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematic('mono-repo-project', { project: appName }, Tree.empty());

    expect(tree.files).toEqual([]);
  });
});
