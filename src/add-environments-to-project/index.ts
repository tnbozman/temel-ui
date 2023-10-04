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

//  import { JsonParseMode, parseJsonAst } from '@angular-devkit/core';

import { join, normalize } from 'path';
import { getWorkspace } from '@schematics/angular/utility/workspace';

export async function setupOptions(host: Tree, options: any): Promise<Tree> {
  const workspace = await getWorkspace(host);
  if (!options.project) {
    options.project = workspace.projects.keys().next().value;
  }
  const project = workspace.projects.get(options.project);
  if (!project) {
    throw new SchematicsException(`Invalid project name: ${options.project}`);
  }

  options.path = join(normalize(project.root), 'src');
  return host;
}

export function addEnvironmentsToProject(options: any): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    await setupOptions(tree, options);

    const envJsTag = '\n  <script src="env.js"></script>\n';
    const projectSrcPath = normalize(options.path + '/');
    const templateSource = apply(url('./files/src'), [
      template({...options}),
      move(projectSrcPath)
    ]);

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
