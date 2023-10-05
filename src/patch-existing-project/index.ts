import {
  Rule,
  SchematicContext,
  MergeStrategy,
  Tree,
  chain,
  externalSchematic,
  mergeWith,
  apply,
  move,
  url,
  template,
  noop,
} from '@angular-devkit/schematics';
import { setupOptions } from '../utils/options-util';
import { normalize } from 'path';
import { addNgModuleImport } from '../utils/ng-util';
import { addScriptsToPackageJson } from '../utils/packageJson-util';
import { ProjectType } from '../utils/enums/project-type.enum';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function patchExistingProject(_options: any): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    await setupOptions(tree, _options);

    const { unitTest, project, path } = _options;

    const projectSrcPath = normalize(path + '/');
    const projectAppPath = `${projectSrcPath}app`;

    // add material.modules
    const projectAppModulesPath = `${projectAppPath}/app.module.ts`;
    tree = addNgModuleImport(tree, projectAppModulesPath, 'MaterialModules', '/material.modules');
    // copy all template

    const appRoutingPath = `${projectAppPath}/app-routing.module.ts`;
    let templateCopyPath = './files/src';
    let templateMovePath = projectSrcPath;
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
      // router is not installed, therefore we adjust the paths so the templates copied don't include the router files
      templateCopyPath += '/app/layouts';
      templateMovePath += 'app/layouts/';
    }
    tree = addScriptsToPackageJson(tree, project, ProjectType.APP);
    const templateSource = apply(url(templateCopyPath), [template({ ..._options }), move(templateMovePath)]);

    return chain([
      unitTest
        ? noop()
        : externalSchematic('@schematics/angular', 'component', {
            name: 'layouts/default-layout',
            project: project,
          }),

      mergeWith(templateSource, MergeStrategy.Overwrite),

      // Generate not-found-page component
      unitTest
        ? noop()
        : externalSchematic('@schematics/angular', 'component', {
            name: 'pages/not-found-page',
            project: project,
          }),

      // Generate landing-page component
      unitTest
        ? noop()
        : externalSchematic('@schematics/angular', 'component', {
            name: 'pages/landing-page',
            project: project,
          }),
      // Add environments using the local schematic
      externalSchematic('./collection.json', 'add-environments-to-project', {
        project: project,
      }),
    ]);
  };
}
