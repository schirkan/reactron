import { IBackendServiceConfig, ICommandResult, ICommandResultWithData, IModuleRepositoryItem } from '@schirkan/reactron-interfaces';
import * as fs from 'fs';
import * as path from 'path';
import { command } from '../commandResultWrapper';
import { ModuleRepository } from "../ModuleRepository";
import { SystemCommand } from "../SystemCommand";
import { IModuleHandler } from './IModuleHandler';
import { refreshModule, loadPackageJson, cleanRepositoryUrl, loadModule } from './ModuleHelper';

export class LocalModuleHandler implements IModuleHandler {

  constructor(
    private config: IBackendServiceConfig,
    private moduleRepository: ModuleRepository,
  ) { }

  public loadAllModules(): IModuleRepositoryItem[] {
    const result: IModuleRepositoryItem[] = [];
    const moduleNames = this.loadModuleNames();
    console.log('found ' + moduleNames.length + ' items in modules folder');
    for (const moduleName of moduleNames) {
      const moduleFolderFull = path.join(this.config.modulesRootPath, moduleName);
      if (fs.statSync(moduleFolderFull).isDirectory()) {
        const newModule = this.loadModule(moduleName);
        if (newModule) {
          result.push(newModule);
        }
      }
    }
    console.log('LocalModuleHandler: ' + result.length + ' modules loaded');
    return result;
  }

  private loadModuleNames(): string[] {
    const items = fs.readdirSync(this.config.modulesRootPath);
    return items.filter(x => x !== 'node_modules' && !x.startsWith('.'));
  }

  public loadModule(folderName: string): IModuleRepositoryItem | undefined {
    const modulePath = path.join(this.config.modulesRootPath, folderName);
    const newModule = loadModule(modulePath);
    const moduleDefinition = newModule && newModule.definition;

    if (moduleDefinition) {
      const gitFolder = path.join(modulePath, '.git');
      moduleDefinition.type = fs.existsSync(gitFolder) ? 'git' : 'local';
    }

    return moduleDefinition;
  };

  public add(repository: string): Promise<ICommandResultWithData<IModuleRepositoryItem | undefined>> {
    return command<IModuleRepositoryItem | undefined>('add', repository, async (result) => {
      // clean repository url
      repository = cleanRepositoryUrl(repository);

      if (!repository) {
        throw new Error('Invalid repository');
      }

      const parts = repository.split('/');
      if (parts.length < 2) {
        throw new Error('Invalid repository');
      }
      const folderName = parts[parts.length - 1];

      // check destination folder 
      const fullModulePath = path.join(this.config.modulesRootPath, folderName);
      if (!this.isDirEmpty(fullModulePath)) {
        throw new Error('Destination folder already exists');
      }

      const gitCloneResult = await SystemCommand.run('git clone ' + repository + ' ' + folderName, this.config.modulesRootPath);
      result.children.push(gitCloneResult);

      let moduleDefinition: IModuleRepositoryItem | undefined;

      if (gitCloneResult.success) {
        moduleDefinition = await this.loadModule(folderName);
        if (moduleDefinition) {
          const installResult = await SystemCommand.run('npm install --production', moduleDefinition.path);
          result.children.push(installResult);

          this.moduleRepository.add(moduleDefinition);
        }
      }

      return moduleDefinition;
    });
  }

  public update(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult> {
    return command('update', moduleDefinition && moduleDefinition.name, async (result) => {
      if (!this.canHandleModule(moduleDefinition) || moduleDefinition.type !== 'git') {
        throw new Error('Can not update module');
      }

      const updateResult = await SystemCommand.run('git fetch --all && git reset --hard origin/master', moduleDefinition.path);
      result.children.push(updateResult);

      if (updateResult.success) {
        moduleDefinition.hasUpdate = false;
        refreshModule(moduleDefinition);
        const installResult = await SystemCommand.run('npm install --production', moduleDefinition.path);
        result.children.push(installResult);
      }
    });
  }

  public remove(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult> {
    return command('remove', moduleDefinition && moduleDefinition.name, async () => {
      if (!this.canHandleModule(moduleDefinition)) {
        throw new Error('Can not remove module');
      }

      const result = await SystemCommand.run('rimraf ' + moduleDefinition.path, this.config.modulesRootPath);
      if (result.success) {
        this.moduleRepository.remove(moduleDefinition.name);
      }
      return result;
    });
  }

  private canHandleModule(moduleDefinition: IModuleRepositoryItem): boolean {
    return !!moduleDefinition && !!moduleDefinition.name &&
      (moduleDefinition.type === 'local' || moduleDefinition.type === 'git');
  }

  public canAdd(repository: string): Promise<boolean> {
    return Promise.resolve(
      repository.startsWith('http://') && repository.includes('github')
    );
  }

  public canRemove(moduleDefinition: IModuleRepositoryItem): Promise<boolean> {
    return Promise.resolve(this.canHandleModule(moduleDefinition));
  }

  public canUpdate(moduleDefinition: IModuleRepositoryItem): Promise<boolean> {
    return Promise.resolve(
      this.canHandleModule(moduleDefinition) && moduleDefinition.type === 'git'
    );
  }

  public hasUpdate(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResultWithData<boolean>> {
    return command<boolean>('checkUpdate', moduleDefinition && moduleDefinition.name, async (result) => {
      if (!this.canHandleModule(moduleDefinition)) {
        return false;
      }

      if (moduleDefinition.type === 'local') {
        return false;
      } else if (moduleDefinition.type === 'git') {
        const result1 = await SystemCommand.run('git remote -v update', moduleDefinition.path);
        result.children.push(result1);
        if (result1.success === false) {
          return false;
        }

        const result2 = await SystemCommand.run('git rev-list HEAD...origin/master --count', moduleDefinition.path);
        result.children.push(result2);
        if (result2.success === false) {
          return false;
        }

        return result2.log[0] !== '0';
      }
      return false;
    });
  }

  private isDirEmpty(dirname: string): boolean {
    try {
      const files = fs.readdirSync(dirname);
      return !files.length;
    } catch (error) {
      return true;
    }
  }
}