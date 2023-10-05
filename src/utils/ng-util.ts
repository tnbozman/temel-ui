import { Tree } from '@angular-devkit/schematics';
import { insertImport, addSymbolToNgModuleMetadata } from '@schematics/angular/utility/ast-utils';
import { InsertChange, Change, applyToUpdateRecorder } from '@schematics/angular/utility/change';
import { buildRelativePath } from '@schematics/angular/utility/find-module';

import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { InsertDirection } from './enums/insert-direction.enum';

/**
 *
 * @param {Tree} tree The current working tree.
 * @param {string} filePath The path to the file in the tree
 * @returns {ts.SourceFile} The TypeScript source file (AST)
 */
export function getSrcFile(tree: Tree, filePath: string) {
  // Read the file from the Tree
  const sourceText = tree.read(filePath);
  // If the file doesn't exist or couldn't be read, throw an error
  if (!sourceText) {
    throw new Error(`Failed to read ${filePath}.`);
  }

  // Convert the file's Buffer to a string
  const srcText = sourceText.toString('utf-8');

  // Create a TypeScript source file (AST)
  return ts.createSourceFile(filePath, srcText, ts.ScriptTarget.Latest, true);
}

/**
 * Creates an InsertChange to add an import statement at the beginning of a file.
 *
 * @param {string} filePath The path to the target file where the import will be added.
 * @param {string} importStatement The complete import statement to be added.
 * @returns {InsertChange} The generated InsertChange representing the addition of the import.
 */

function addImportAtTopOfFile(filePath: string, importStatement: string): InsertChange {
  return new InsertChange(filePath, 0, importStatement);
}

/**
 * Generates a TypeScript import statement string.
 *
 * @param {string} importName - The name or names of the entities to be imported.
 * @param {string} importPath - The module or file path from which the entities are imported.
 * @returns {string} - The complete import statement string.
 */
export function buildImportStatement(importName: string, importPath: string): string {
  return `import { ${importName} } from '${importPath}';\n`;
}

/**
 * Adds a TypeScript import statement to a specified file if it doesn't already exist.
 *
 * @param {Tree} tree - The current working tree.
 * @param {string} filePath - The path to the file where the import should be added.
 * @param {string} importName - The name or names of the entities to be imported.
 * @param {string} importPath - The module or file path from which the entities are imported.
 * @returns {Tree} - The updated tree.
 */

export function addImportToFile(tree: Tree, filePath: string, importName: string, importPath: string): Tree {
  // Get the current content of the file from the tree.
  const currentContent = tree.read(filePath)!.toString('utf-8');
  // Generate the desired import statement.
  const importStatement = buildImportStatement(importName, importPath);
  // Check if the import statement already exists in the file.
  if (currentContent.indexOf(importStatement) > -1) {
    // import already exists
    return tree;
  }
  // Get an InsertChange to add the import statement to the top of the file.
  const importChange = addImportAtTopOfFile(filePath, importStatement);

  return insertChangeToFile(tree, filePath, importChange, InsertDirection.BEFORE);
}

/**
 * Adds a TypeScript import statement to a specified file with a relative or absolute path.
 * If the provided path is not absolute (doesn't start with '@'), the function calculates
 * a relative path between the target file and the import source.
 *
 * @param {Tree} tree - The current working tree.
 * @param {string} filePath - The path to the target file where the import should be added.
 * @param {string} importName - The name or names of the entities to be imported.
 * @param {string} absoluteImportPath - The absolute module or file path from which the entities are imported.
 * @returns {Tree} - The updated tree.
 */
export function addRelativeImportToFile(
  tree: Tree,
  filePath: string,
  importName: string,
  absoluteImportPath: string,
): Tree {
  const srcFile = getSrcFile(tree, filePath);

  // Calculate the relative path for the import
  let importPath = absoluteImportPath.startsWith('@')
    ? absoluteImportPath
    : buildRelativePath(filePath, absoluteImportPath);

  // Use the insertImport function to generate the necessary Change
  const importChange = insertImport(srcFile, filePath, importName, importPath);

  // Check if the change is an InsertChange and commit it to the Tree
  return insertChangeToFile(tree, filePath, importChange, InsertDirection.BEFORE);
}

/**
 * Adds the specified module import to an Angular NgModule and updates the NgModule's imports array.
 *
 * @param {Tree} tree - The current working tree or filesystem abstraction.
 * @param {string} filePath - The path of the NgModule file where the import should be added.
 * @param {string} importName - The name of the module to be imported.
 * @param {string} absoluteImportPath - The absolute path to the module to be imported.
 *
 * @returns {Tree} - The modified tree after the import has been added and NgModule updated.
 */
export function addNgModuleImport(tree: Tree, filePath: string, importName: string, absoluteImportPath: string): Tree {
  // Add the specified import to the file. If the import already exists, this function ensures it's not duplicated.
  tree = addRelativeImportToFile(tree, filePath, importName, absoluteImportPath);
  // Parse the file to get a TypeScript AST (Abstract Syntax Tree)
  const srcFile = getSrcFile(tree, filePath);
  // Get the changes needed to add the specified importName to the NgModule's imports metadata
  const changes = addSymbolToNgModuleMetadata(srcFile, filePath, 'imports', importName);
  if (changes && changes.length > 0) {
    // Start recording updates for the specified file
    const recorder = tree.beginUpdate(filePath);
    // Apply the changes to the AST and prepare them for recording
    applyToUpdateRecorder(recorder, changes);
    // Commit the updates to the tree
    tree.commitUpdate(recorder);
  }
  return tree;
}

/**
 * Inserts a specified change into a file within the provided tree.
 * The change's position can be controlled with the provided direction.
 *
 * @param {Tree} tree - The current working tree or filesystem abstraction.
 * @param {string} filepath - The path of the file where the change should be applied.
 * @param {Change} change - The change to be applied, which is expected to be an instance of InsertChange.
 * @param {InsertDirection} direction - Enum value that determines the direction of insertion (either before or after the specified position).
 *
 * @returns {Tree} - The modified tree after the change has been applied.
 */
export function insertChangeToFile(tree: Tree, filepath: string, change: Change, direction: InsertDirection): Tree {
  if (change instanceof InsertChange) {
    const insertChange = change as InsertChange;
    const recorder = tree.beginUpdate(filepath);
    if (direction === InsertDirection.BEFORE) {
      recorder.insertLeft(insertChange.pos, insertChange.toAdd);
    } else {
      recorder.insertRight(insertChange.pos, insertChange.toAdd);
    }
    tree.commitUpdate(recorder);
  }
  return tree;
}
