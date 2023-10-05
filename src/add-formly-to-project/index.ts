import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  apply,
  url,
  template,
  move,
  mergeWith,
  externalSchematic,
  MergeStrategy,
  noop,
} from '@angular-devkit/schematics';
import { normalize } from 'path';
import { setupOptions } from '../utils/options-util';
import { addRelativeImportToFile /*insertChangeToTextFile*/ } from '../utils/ng-util';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function addFormlyToProject(_options: any): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    await setupOptions(tree, _options);
    const { unitTest, project, path } = _options;
    const projectSrcPath = normalize(path + '/');
    const templateCopyPath = './files/src';
    const templateMovePath = projectSrcPath;

    const templateSource = apply(url(templateCopyPath), [template({ ..._options }), move(templateMovePath)]);

    return chain([
      unitTest
        ? noop()
        : externalSchematic('@ngx-formly/schematics', 'ng-add', {
            uiTheme: 'material',
            project: project,
          }),

      unitTest
        ? noop()
        : externalSchematic('@schematics/angular', 'component', {
            name: 'pages/basic-form-page',
            project: project,
          }),

      mergeWith(templateSource, MergeStrategy.Overwrite),
      (tree: Tree) => {
        const appModulePath = `${templateCopyPath}/app/app.module.ts`; // Update with your app module path
        const appContent = tree.read(appModulePath);

        if (!appContent) {
          throw new Error(`Failed to read ${appModulePath}`);
        }

        const updatedAppContent = appContent
          .toString()
          .replace('ReactiveFormsModule', 'FormsModule, ReactiveFormsModule');

        tree.overwrite(appModulePath, updatedAppContent);

        const routesPath = `${templateCopyPath}/app/router/app.routes.ts`;
        tree = addRelativeImportToFile(
          tree,
          routesPath,
          'BasicFormPageComponent',
          `${templateCopyPath}/app/pages/basic-form-page/basic-form-page.component`,
        );

        return tree;
      },
    ]);
  };
}
