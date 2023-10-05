import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';

export function addScriptsToPackageJson(tree: Tree, projectName: string): Tree {
  const packageJsonPath = '/package.json';
  const buffer = tree.read(packageJsonPath);
  if (!buffer) {
    throw new SchematicsException('Could not read package.json');
  }
  const json = JSON.parse(buffer.toString());

  json.scripts[`watch:${projectName}`] = `ng build ${projectName} --watch`;
  json.scripts[`build:${projectName}`] = `ng build ${projectName}`;

  const formattedScript = JSON.stringify(json);
  tree.overwrite(packageJsonPath, formattedScript);
  return tree;
}

export function patchExistingLib(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const projectName = _options.project;
    if (!projectName) {
      throw new SchematicsException('Project name is required');
    }

    addScriptsToPackageJson(tree, projectName);
    return tree;
  };
}
