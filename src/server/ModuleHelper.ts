import * as fs from 'fs';
import * as path from 'path';
import { IModuleRepositoryItem } from '@schirkan/reactron-interfaces';

export function cleanRepositoryUrl(repository?: string) {
  repository = (repository || '').trim();
  // remove git+ from start
  if (repository.startsWith('git+http')) {
    repository = repository.substr(4);
  }
  // remove / from end
  if (repository.endsWith('/')) {
    repository = repository.substr(0, repository.length - 1);
  }
  // remove .git from end
  if (repository.endsWith('.git')) {
    repository = repository.substr(0, repository.length - 4);
  }
  return repository;
}

export function loadPackageJson(packageFile: string): any {
  try {
    const fileContent = fs.readFileSync(packageFile, { encoding: 'utf-8' });
    const p = JSON.parse(fileContent);
    console.log('reading ' + packageFile);
    return p;
  }
  catch (error) {
    console.log('Error reading ' + packageFile, error);
    return undefined;
  }
}

export function refreshModule(moduleDefinition: IModuleRepositoryItem) {
  const packageFile = path.join(moduleDefinition.path, 'package.json');
  const p = loadPackageJson(packageFile);

  moduleDefinition.displayName = p.displayName || p.name,
  moduleDefinition.description = p.description;
  moduleDefinition.version = p.version;
  moduleDefinition.author = p.author;
}
