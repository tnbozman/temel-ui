import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('add-golden-layout-to-project', () => {
  const appName = 'test-app';
  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematic('add-golden-layout-to-project', { project: appName }, Tree.empty());

    expect(tree.files).toEqual([]);
  });
});
