import { IBackendServiceConfig, IModuleRepositoryItem } from '@schirkan/reactron-interfaces';
import * as fs from 'fs';
import * as path from 'path';

export class ModuleLoader {
  private modulesPath: string;
  private modulesPackageFile: string;

  public static cleanRepositoryUrl(repository?: string) {
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

  public static loadPackageJson(packageFile: string): any {
    try {
      const fileContent = fs.readFileSync(packageFile, { encoding: 'utf-8' });
      const p = JSON.parse(fileContent);
      console.log('reading ' + packageFile);
      return p;
    } catch (error) {
      console.log('Error reading ' + packageFile, error);
      return undefined;
    }
  }

  constructor(
    private config: IBackendServiceConfig
  ) {
    this.modulesPath = path.join(this.config.root, 'modules', 'node_modules');
    this.modulesPackageFile = path.join(this.config.root, 'modules', 'package.json');
    if (!fs.existsSync(this.modulesPackageFile)) {
      this.createModulePackageJson();
    }
  }

  private createModulePackageJson() {
    const content = `{
  "name": "@schirkan/reactron-modules",
  "version": "1.0.0",
  "license": "MIT",
  "repository": {
      "type": "git",
      "url": "https://github.com/schirkan/reactron"
  },
  "dependencies": {
  }
}`;
    fs.writeFileSync(this.modulesPackageFile, content);
  }

  public loadAllModules(): IModuleRepositoryItem[] {
    const result: IModuleRepositoryItem[] = [];
    // const items = fs.readdirSync(this.modulesPath);
    const moduleNames = this.loadModuleNames();
    console.log('found ' + moduleNames.length + ' modules');
    for (const moduleName of moduleNames) {
      const moduleFolderFull = path.join(this.modulesPath, moduleName);
      if (fs.statSync(moduleFolderFull).isDirectory()) {
        const newModule = this.loadModule(moduleName);
        if (newModule) {
          result.push(newModule);
        }
      }
    }
    return result;
  }

  public loadModuleNames(): string[] {
    const p = ModuleLoader.loadPackageJson(this.modulesPackageFile);
    return Object.keys(p && p.dependencies || {});
  }

  public refreshModule(moduleDefinition: IModuleRepositoryItem) {
    const packageFile = path.join(moduleDefinition.path, 'package.json');
    const p = ModuleLoader.loadPackageJson(packageFile);

    moduleDefinition.displayName = p.displayName || p.name,
    moduleDefinition.description = p.description;
    moduleDefinition.version = p.version;
    moduleDefinition.author = p.author;
  }

  public loadModule(folderName: string): IModuleRepositoryItem | undefined {
    const packageFile = path.join(this.modulesPath, folderName, 'package.json');
    const p = ModuleLoader.loadPackageJson(packageFile);

    const moduleDefinition = {
      name: p.name,
      displayName: p.displayName || p.name,
      path: path.join(this.modulesPath, folderName),
      description: p.description,
      version: p.version,
      author: p.author,
      repository: p.repository && p.repository.url || p.repository,
      canRemove: true
    } as IModuleRepositoryItem;

    if (p._requested && p._requested.type === 'git') {
      moduleDefinition.type = 'git';
    }
    else if (p._requested && p._requested.name) {
      moduleDefinition.type = 'npm';
    }
    // TODO other sources

    // clean repository url
    moduleDefinition.repository = ModuleLoader.cleanRepositoryUrl(moduleDefinition.repository);

    if (p.browser) {
      moduleDefinition.browserFile = path.join('modules', folderName, p.browser);
      if (!fs.existsSync(path.join(this.config.root, moduleDefinition.browserFile))) {
        console.log('Missing browserFile for ' + moduleDefinition.name);
        moduleDefinition.browserFile = undefined;
      }
    }

    if (p.main) {
      moduleDefinition.serverFile = path.join(this.modulesPath, folderName, p.main);
      if (!fs.existsSync(moduleDefinition.serverFile)) {
        console.log('Missing serverFile for ' + moduleDefinition.name);
        moduleDefinition.serverFile = undefined;
      }
    }

    if (!moduleDefinition.browserFile && !moduleDefinition.serverFile) {
      console.log('No module in folder ' + folderName);
      return;
    }

    console.log('Module loaded: ' + moduleDefinition.name);
    return moduleDefinition;
  };
}