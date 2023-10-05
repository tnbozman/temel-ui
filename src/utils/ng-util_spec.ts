import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { InsertChange } from '@schematics/angular/utility/change';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import {
  getSrcFile,
  buildImportStatement,
  addImportToFile,
  addRelativeImportToFile,
  addNgModuleImport,
  insertChangeToFile,
} from './ng-util';

import { InsertDirection } from './enums/insert-direction.enum';

describe('ng-util', () => {
  let tree: UnitTestTree;
  const testFilePath = '/projects/test-app/src/app/app.component.ts';
  const initialFileContent = `import { NgModule } from '@angular/core';

    @NgModule({
      declarations: [],
      imports: []
    })
    export class AppModule { }`;

  const insertTestPath = '/test-file.txt';
  const Content = 'Hello World';
  beforeEach(() => {
    tree = new UnitTestTree(Tree.empty()); // start with an empty tree
    tree.create(testFilePath, initialFileContent);
    tree.create(insertTestPath, Content);
  });

  it('should return a TypeScript SourceFile', () => {
    // act
    const result = getSrcFile(tree, testFilePath);
    // assert
    expect(ts.isSourceFile(result)).toBeTrue();
    expect(result.getText()).toContain(initialFileContent);
  });

  it('build an import statement', () => {
    // arrange
    const importName = '';
    const importPath = '';
    const expected = `import { ${importName} } from '${importPath}';\n`;
    // act
    const result = buildImportStatement(importName, importPath);
    // assert
    expect(result).toEqual(expected);
  });

  it('should add the specified import and update NgModule imports', () => {
    // arrange
    const importName = 'TestModule';
    const absoluteImportPath = '@app/test/test.module';
    const expectImportStatement = `import { ${importName} } from '${absoluteImportPath}'`;
    const expectModuleImports = `imports: [
    ${importName}
  ]`;
    // act
    const resultTree = addNgModuleImport(tree, testFilePath, importName, absoluteImportPath);
    // assert
    const updatedContent = resultTree.readText(testFilePath);
    expect(updatedContent).toContain(expectImportStatement);
    expect(updatedContent).toContain(expectModuleImports);
  });

  it('add two imports and update NgModule imports', () => {
    // arrange
    const importName = 'TestModule';
    const absoluteImportPath = '@app/test/test.module';
    const otherImportName = 'OtherModule';
    const otherAbsoluteImportPath = '@app/other/other.module';
    const expectImportStatement = `import { ${importName} } from '${absoluteImportPath}';
import { ${otherImportName} } from '${otherAbsoluteImportPath}';`;
    const expectModuleImports = `imports: [
    ${importName},
    ${otherImportName}
  ]`;
    // act
    const treeResult = addNgModuleImport(tree, testFilePath, importName, absoluteImportPath);
    const treeFinalResult = addNgModuleImport(treeResult, testFilePath, otherImportName, otherAbsoluteImportPath);
    // assert
    const updatedContent = treeFinalResult.readText(testFilePath);
    expect(updatedContent).toContain(expectImportStatement);
    expect(updatedContent).toContain(expectModuleImports);
  });

  it('should add the specified import', () => {
    // arrange
    const expected = `import { Component } from '@angular/core';`;
    // act
    addImportToFile(tree, testFilePath, 'Component', '@angular/core');
    // assert
    const content = tree.readContent(testFilePath);
    expect(content).toContain(expected);
  });

  it('should use a relative path for the import', () => {
    // arrange
    const relativeImportPath = '/projects/test-app/src/app/components/relative-path-example';
    const expected = `import { RelativeComponent } from './components/relative-path-example';`;
    // act
    addRelativeImportToFile(tree, testFilePath, 'RelativeComponent', relativeImportPath);
    const content = tree.readContent(testFilePath);
    expect(content).toContain(expected);
  });

  it('should not duplicate an existing import', () => {
    // This test depends on the behavior of 'insertImport'.
    // If 'insertImport' is designed to avoid duplicate imports, then this test should validate that.
    // Otherwise, this test can be omitted or updated accordingly.

    addImportToFile(tree, testFilePath, 'NgModule', '@angular/core'); // NgModule is already imported in initialFileContent
    const content = tree.readContent(testFilePath);
    const matches = content.match(/import { NgModule } from '@angular\/core';/g) || [];
    expect(matches.length).toBe(1);
  });

  it('should insert content before a given position when direction is BEFORE', () => {
    const change = new InsertChange('/test-file.txt', 5, ' beautiful');
    insertChangeToFile(tree, '/test-file.txt', change, InsertDirection.BEFORE);
    const content = tree.readContent('/test-file.txt');
    expect(content).toBe('Hello beautiful World');
  });

  it('should insert content after a given position when direction is AFTER', () => {
    const change = new InsertChange('/test-file.txt', 11, ' beautiful');
    insertChangeToFile(tree, '/test-file.txt', change, InsertDirection.AFTER);
    const content = tree.readContent('/test-file.txt');
    expect(content).toBe('Hello World beautiful');
  });
});
