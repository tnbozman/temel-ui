import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  externalSchematic,
  mergeWith,
  apply,
  move,
  url,
  template,
} from '@angular-devkit/schematics';
import { setupOptions } from '../utils/options-util';
import { normalize } from 'path';
import { addNgModuleImport } from '../utils/ng-util';
import { addScriptsToPackageJson } from '../utils/packageJson-util';
import { ProjectType } from '../utils/enums/project-type.enum';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function patchExistingProject(_options: any): Rule {
  const projectSrcPath = normalize(_options.path + '/');

  return (tree: Tree, _context: SchematicContext) => {
    return chain([
      async (_tree: Tree, _context: SchematicContext) => {
        await setupOptions(_tree, _options);
        const projectAppPath = `${projectSrcPath}app`;
        // add material.modules
        const projectAppModulesPath = `${projectAppPath}/app.module.ts`;
        _tree = addNgModuleImport(tree, projectAppModulesPath, 'MaterialModules', '/material.modules');

        // copy all template
        const templateSource = apply(url('./files/src'), [template({ ..._options }), move(projectSrcPath)]);
        _tree = mergeWith(templateSource)(tree, _context) as Tree;

        const appRoutingPath = `${projectAppPath}/app-routing.module.ts`;
        if (tree.exists(appRoutingPath)) {
          // delete app-routing.module.ts
          // copy all above should have add the approved router approach
          tree.delete(appRoutingPath);
          // Update app.module.ts
          const content = tree.read(`${projectAppPath}/app.module.ts`)?.toString();
          if (content) {
            const newContent = content.replace('app-routing.module', 'router/app-routing.module');
            tree.overwrite(`${projectAppPath}/app.module.ts`, newContent);
          }
        } else {
          // router is not installed on project remove router files added in copy all
          tree.delete(`${projectAppPath}/router`);
        }
        addScriptsToPackageJson(tree, _options.project, ProjectType.APP);
      },
      externalSchematic('@schematics/angular', 'component', {
        name: 'layouts/default-layout',
        project: _options.project,
      }),

      (tree: Tree) => {
        const templateSource = apply(url('./files/src'), [template({ ..._options }), move(projectSrcPath)]);
        return mergeWith(templateSource)(tree, _context);
      },

      externalSchematic('@schematics/angular', 'component', {
        name: 'layouts/default-layout',
        project: _options.project,
      }),

      // Generate not-found-page component
      externalSchematic('@schematics/angular', 'component', {
        name: 'pages/not-found-page',
        project: _options.project,
      }),

      // Generate landing-page component
      externalSchematic('@schematics/angular', 'component', {
        name: 'pages/landing-page',
        project: _options.project,
      }),
      // Add environments using the local schematic
      externalSchematic('../collection.json', 'add-environments-to-project', {
        project: _options.project,
      }),
    ])(tree, _context);
  };
}
