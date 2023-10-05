import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('add-mfe-project', () => {
  const appName = 'test-app';
  const appPort = 5201;
  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematic('add-mfe-project', { project: appName, port: appPort }, Tree.empty());

    expect(tree.files).toEqual([]);
  });
});
