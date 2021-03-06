import { IBackendServiceConfig, ICommandResult, ICommandResultWithData, IModuleRepositoryItem } from '@schirkan/reactron-interfaces';
import * as fs from 'fs';
import * as path from 'path';
import { command } from '../commandResultWrapper';
import { ModuleRepository } from "../ModuleRepository";
import { SystemCommand } from "../SystemCommand";
import { IModuleHandler } from './IModuleHandler';
import { refreshModule, loadPackageJson, cleanRepositoryUrl, loadModule } from './ModuleHelper';

export class NpmModuleHandler implements IModuleHandler {
  private modulesPath: string;
  private modulesPackageFile: string;

  constructor(
    private config: IBackendServiceConfig,
    private moduleRepository: ModuleRepository,
  ) {
    this.modulesPath = path.join(this.config.modulesRootPath, 'node_modules');
    this.modulesPackageFile = path.join(this.config.modulesRootPath, 'package.json');
    if (!fs.existsSync(this.modulesPackageFile)) {
      this.createModulePackageJson();
    }
    SystemCommand.run('npm config set loglevel warn', this.config.modulesRootPath);
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
    console.log('NpmModuleHandler: ' + result.length + ' modules loaded');
    return result;
  }

  public loadModuleNames(): string[] {
    const p = loadPackageJson(this.modulesPackageFile);
    return Object.keys(p && p.dependencies || {});
  }

  public loadModule(folderName: string): IModuleRepositoryItem | undefined {
    const modulePath = path.join(this.modulesPath, folderName);
    const newModule = loadModule(modulePath);
    const moduleDefinition = newModule && newModule.definition;

    if (moduleDefinition) {
      const requestedType = newModule && newModule.package && newModule.package._requested && newModule.package._requested.type;
      moduleDefinition.type = requestedType === 'git' ? 'npm+git' : 'npm';
    }

    return moduleDefinition;
  }

  public updateAllModules(): Promise<ICommandResult> {
    return command('updateAll', undefined, async (result) => {
      const result1 = await SystemCommand.run('npm update', this.config.modulesRootPath);
      result.children.push(result1);
      const result2 = await SystemCommand.run('npm audit fix', this.config.modulesRootPath);
      result.children.push(result2);
    });
  }

  public add(repository: string): Promise<ICommandResultWithData<IModuleRepositoryItem | undefined>> {
    return command<IModuleRepositoryItem | undefined>('add', repository, async (result) => {
      // clean repository url
      repository = cleanRepositoryUrl(repository);

      if (!repository) {
        throw new Error('Invalid repository');
      }

      const existingModule = this.moduleRepository.getAll().find(x => x.repository === repository);
      if (existingModule) {
        throw new Error('Module already exists: ' + existingModule.name);
      }

      const npmInstallResult = await SystemCommand.run('npm i --save ' + repository, this.config.modulesRootPath);
      result.children.push(npmInstallResult);

      let moduleDefinition: IModuleRepositoryItem | undefined;

      if (npmInstallResult.success) {
        // find newly added module
        const moduleNames = this.loadModuleNames();
        const registeredModuleNames = this.moduleRepository.getAll().map(x => x.name);
        const newModuleNames = moduleNames.filter(x => !registeredModuleNames.includes(x));
        if (newModuleNames.length === 1) {
          moduleDefinition = this.loadModule(newModuleNames[0]); // TODO: namespace?
          if (moduleDefinition) {
            this.moduleRepository.add(moduleDefinition);
          }
        }
      }

      return moduleDefinition;
    });
  }

  public update(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult> {
    return command('update', moduleDefinition && moduleDefinition.name, async () => {
      if (!this.canHandleModule(moduleDefinition)) {
        throw new Error('Can not update module');
      }

      let updateResult: ICommandResult;
      if (moduleDefinition.type === 'npm') {
        updateResult = await SystemCommand.run('npm install --save ' + moduleDefinition.name + '@' + moduleDefinition.updateVersion, this.config.modulesRootPath);
      } else {
        updateResult = await SystemCommand.run('npm update ' + moduleDefinition.name, this.config.modulesRootPath);
      }

      if (updateResult.success) {
        moduleDefinition.hasUpdate = false;
        refreshModule(moduleDefinition);
      }

      return updateResult;
    });
  }

  public remove(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult> {
    return command('remove', moduleDefinition && moduleDefinition.name, async () => {
      if (!this.canHandleModule(moduleDefinition)) {
        throw new Error('Can not remove module');
      }

      const result = await SystemCommand.run('npm un ' + moduleDefinition.name, this.config.modulesRootPath);
      if (result.success) {
        this.moduleRepository.remove(moduleDefinition.name);
      }
      return result;
    });
  }

  private canHandleModule(moduleDefinition: IModuleRepositoryItem): boolean {
    return !!moduleDefinition && !!moduleDefinition.name &&
      (moduleDefinition.type === 'npm' || moduleDefinition.type === 'npm+git');
  }

  public canAdd(repository: string): Promise<boolean> {
    return Promise.resolve(!!repository);
  }

  public canRemove(moduleDefinition: IModuleRepositoryItem): Promise<boolean> {
    return Promise.resolve(this.canHandleModule(moduleDefinition));
  }

  public canUpdate(moduleDefinition: IModuleRepositoryItem): Promise<boolean> {
    return Promise.resolve(this.canHandleModule(moduleDefinition));
  }

  public hasUpdate(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResultWithData<boolean>> {
    return command<boolean>('checkUpdate', moduleDefinition && moduleDefinition.name, async (result) => {
      if (!this.canHandleModule(moduleDefinition)) {
        return false;
      }

      if (moduleDefinition.type === 'npm') {
        const npmViewVersionResult = await SystemCommand.run('npm view ' + moduleDefinition.name + ' version', this.config.modulesRootPath);
        result.children.push(npmViewVersionResult);
        if (npmViewVersionResult.success === false) {
          return false;
        }
        moduleDefinition.updateVersion = npmViewVersionResult.log[0];
        moduleDefinition.hasUpdate = moduleDefinition.version !== moduleDefinition.updateVersion;
        if (moduleDefinition.hasUpdate) {
          result.log.push('New version available: ' + moduleDefinition.updateVersion);
        }
        return moduleDefinition.hasUpdate;
      } else if (moduleDefinition.type === 'npm+git') {
        const packagePath = path.join(moduleDefinition.path, 'package.json');
        const packageJson = loadPackageJson(packagePath);
        let localHash = packageJson && packageJson._resolved && packageJson._resolved;
        if (localHash && localHash.length > 40) {
          localHash = localHash.substr(localHash.length - 40); // get SHA-1 from git url

          const gitRemoteResult = await SystemCommand.run('git ls-remote ' + moduleDefinition.repository, this.config.modulesRootPath);
          result.children.push(gitRemoteResult);
          if (gitRemoteResult.success === false) {
            return false;
          }
          const remoteHash = gitRemoteResult.log[0].substr(0, 40); // get SHA-1 for HEAD

          moduleDefinition.hasUpdate = localHash !== remoteHash;
          if (moduleDefinition.hasUpdate) {
            result.log.push('New commit available: ' + remoteHash);
          }
          return moduleDefinition.hasUpdate;
        }
      }

      return false;
    });
  }
}