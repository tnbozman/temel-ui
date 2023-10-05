import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { setupOptions } from '../utils/options-util';
import { normalize } from 'path';
import { addNgModuleImport } from '../utils/ng-util';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function patchExistingProject(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return chain([
      async (_tree: Tree, _context: SchematicContext) => {
        await setupOptions(_tree, _options);

        const projectSrcPath = normalize(_options.path + '/');
        const projectAppModulesPath = `${projectSrcPath}app/app.module.ts`;

        addNgModuleImport(tree, projectAppModulesPath, 'MaterialModules', '/material.modules');
      },
    ])(tree, _context);
  };
}
