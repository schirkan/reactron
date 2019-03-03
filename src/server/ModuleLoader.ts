import { IBackendServiceConfig, IModuleRepositoryItem } from '@schirkan/reactron-interfaces';
import * as fs from 'fs';
import * as path from 'path';

export class ModuleLoader {
  private modulesPath: string;

  public static cleanRepositoryUrl(repository?: string) {
    repository = (repository || '').trim();

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

  constructor(
    private config: IBackendServiceConfig
  ) {
    this.modulesPath = path.join(this.config.root, 'modules');
  }

  public async loadAllModules(): Promise<IModuleRepositoryItem[]> {
    const result: IModuleRepositoryItem[] = [];
    const items = fs.readdirSync(this.modulesPath);
    for (const item of items) {
      const moduleFolderFull = path.join(this.modulesPath, item);
      if (fs.statSync(moduleFolderFull).isDirectory()) {
        const newModule = await this.loadModule(item);
        if (newModule) {
          result.push(newModule);
        }
      }
    }
    return result;
  }

  public async loadModule(folderName: string): Promise<IModuleRepositoryItem | undefined> {
    const packageFile = path.join(this.modulesPath, folderName, 'package.json');
    let p: any;
    try {
      const fileContent = fs.readFileSync(packageFile, { encoding: 'utf-8' });
      p = JSON.parse(fileContent);
      console.log('reading ' + packageFile);
    } catch (error) {
      console.log('Error reading package.json', error);
      return;
    }

    const moduleDefinition = {
      displayName: p.displayName || p.name,
      path: path.join(this.modulesPath, folderName),
      name: p.name,
      description: p.description,
      version: p.version,
      author: p.author,
      repository: p.repository && p.repository.url || p.repository,
      isBuilded: true
    } as IModuleRepositoryItem;

    // clean repository url
    moduleDefinition.repository = ModuleLoader.cleanRepositoryUrl(moduleDefinition.repository);

    if (p.browser) {
      moduleDefinition.browserFile = path.join('modules', folderName, p.browser);
      if (!fs.existsSync(path.join(this.config.root, moduleDefinition.browserFile))) {
        moduleDefinition.isBuilded = false;
      }
    }

    if (p.main) {
      moduleDefinition.serverFile = path.join(this.config.root, 'modules', folderName, p.main);
      if (!fs.existsSync(moduleDefinition.serverFile)) {
        moduleDefinition.isBuilded = false;
      }
    }

    if (!moduleDefinition.browserFile && !moduleDefinition.serverFile) {
      console.log('No module in folder ' + folderName);
      return;
    }
    moduleDefinition.canBuild = p.scripts && !!p.scripts.build;
    moduleDefinition.canInstall = !!(
      (p.dependencies && Object.keys(p.dependencies).length) ||
      (p.devDependencies && Object.keys(p.devDependencies).length)
    );
    moduleDefinition.canRemove = true;
    moduleDefinition.isInstalled = fs.existsSync(path.join(this.config.root, 'modules', folderName, 'node_modules'));

    console.log('Module loaded: ' + moduleDefinition.name);
    return moduleDefinition;
  };
}