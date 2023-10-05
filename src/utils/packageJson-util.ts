import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { ProjectType } from './enums/project-type.enum';
/**
 * Modifies the package.json file to add scripts for building and watching the specified project.
 *
 * @param {Tree} tree - The current state of the file system tree.
 * @param {string} projectName - Name of the Angular project.
 * @returns {Tree} - The modified file system tree.
 * @throws {SchematicsException} - Throws an exception if the package.json file cannot be read.
 */
export function addScriptsToPackageJson(tree: Tree, projectName: string, type: ProjectType): Tree {
  const packageJsonPath = '/package.json';
  const buffer = tree.read(packageJsonPath);
  if (!buffer) {
    throw new SchematicsException('Could not read package.json');
  }
  const json = JSON.parse(buffer.toString());
  json.scripts[`build:${projectName}`] = `ng build ${projectName}`;
  if (type === ProjectType.LIB) {
    json.scripts[`watch:${projectName}`] = `ng build ${projectName} --watch`;
  } else {
    json.scripts[`serve:${projectName}`] = `ng serve ${projectName} -o`;
  }

  const formattedScript = JSON.stringify(json);
  tree.overwrite(packageJsonPath, formattedScript);
  return tree;
}
