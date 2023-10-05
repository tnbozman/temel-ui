// https://www.telerik.com/blogs/angular-basics-using-environmental-variables-organize-build-configurations
// https://dev.to/this-is-angular/angular-15-what-happened-to-environmentts-koh
import {
  Rule,
  SchematicContext,
  MergeStrategy,
  Tree,
  SchematicsException,
  apply,
  url,
  move,
  mergeWith,
  chain,
  template,
} from '@angular-devkit/schematics';

import { normalize } from 'path';
import { setupOptions } from '../utils/options-util';

export function addEnvironmentsToProject(options: any): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    await setupOptions(tree, options);

    const envJsTag = '\n  <script src="env.js"></script>\n';
    const projectSrcPath = normalize(options.path + '/');
    const templateSource = apply(url('./files/src'), [template({ ...options }), move(projectSrcPath)]);

    const indexPath = projectSrcPath + 'index.html';
    const buffer = tree.read(indexPath);
    if (!buffer) {
      throw new SchematicsException(`Read operation failed for ${indexPath}`);
    }

    const content = buffer.toString();

    if (content.indexOf(envJsTag) === -1) {
      // Add script tag
      const recorder = tree.beginUpdate(indexPath);
      const insertPosition = content.lastIndexOf('</body>');
      recorder.insertRight(insertPosition, envJsTag);
      tree.commitUpdate(recorder);
    }

    return chain([mergeWith(templateSource, MergeStrategy.Overwrite)]);
  };
}
