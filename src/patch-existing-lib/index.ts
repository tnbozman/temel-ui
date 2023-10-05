import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';

import { addScriptsToPackageJson } from '../utils/packageJson-util';
import { ProjectType } from '../utils/enums/project-type.enum';

export function patchExistingLib(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const projectName = _options.project;
    if (!projectName) {
      throw new SchematicsException('Project name is required');
    }
    addScriptsToPackageJson(tree, projectName, ProjectType.LIB);
    return tree;
  };
}
