import { Tree, SchematicsException } from '@angular-devkit/schematics';
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
