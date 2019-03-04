import { IBackendServiceConfig, ICommandResult, ICommandResultWithData, IModuleRepositoryItem } from '@schirkan/reactron-interfaces';
import * as path from 'path';
import { command } from './commandResultWrapper';
import { ModuleLoader } from "./ModuleLoader";
import { ModuleRepository } from "./ModuleRepository";
import { SystemCommand } from "./SystemCommand";

export class ModuleManager {
  private modulesRootPath: string;
  public moduleLoader: ModuleLoader;

  constructor(
    private config: IBackendServiceConfig,
    private moduleRepository: ModuleRepository,
  ) {
    this.moduleLoader = new ModuleLoader(this.config);
    this.modulesRootPath = path.join(this.config.root, 'modules');
  }

  public loadAllModules(): void {
    const modules = this.moduleLoader.loadAllModules();
    modules.forEach(this.moduleRepository.add);
    SystemCommand.run('npm config set loglevel warn', this.modulesRootPath);
  }

  public getAll(): IModuleRepositoryItem[] {
    return this.moduleRepository.getAll();
  }

  public get(moduleName: string): IModuleRepositoryItem | undefined {
    return this.moduleRepository.get(moduleName);
  }

  public add(repository: string): Promise<ICommandResultWithData<IModuleRepositoryItem | undefined>> {
    return command<IModuleRepositoryItem | undefined>('add', repository, async (result) => {
      // clean repository url
      repository = ModuleLoader.cleanRepositoryUrl(repository);

      if (!repository) {
        throw new Error('Invalid repository');
      }

      const existingModule = this.getAll().find(x => x.repository === repository);
      if (existingModule) {
        throw new Error('Module already exists :' + repository);
      }

      const npmInstallResult = await SystemCommand.run('npm i --save ' + repository, this.modulesRootPath);
      result.children.push(npmInstallResult);

      let moduleDefinition: IModuleRepositoryItem | undefined;

      if (npmInstallResult.success) {
        // find newly added module
        const moduleNames = this.moduleLoader.loadModuleNames();
        const registeredModuleNames = this.moduleRepository.getAll().map(x => x.name);
        const newModuleNames = moduleNames.filter(x => !registeredModuleNames.includes(x))
        if (newModuleNames.length === 1) {
          moduleDefinition = this.moduleLoader.loadModule(newModuleNames[0]);
          if (moduleDefinition) {
            this.moduleRepository.add(moduleDefinition);
          }
        }
      }

      // const parts = repository.split('/');
      // const folderName = parts[parts.length - 1];

      // // check destination folder 
      // const fullModulePath = path.join(this.modulesRootPath, folderName);
      // if (!this.isDirEmpty(fullModulePath)) {
      //   throw new Error('Destination folder already exists');
      // }

      // const resultGitClone = await SystemCommand.run('git clone ' + repository + ' ' + folderName, this.modulesRootPath);
      // result.children.push(resultGitClone);

      // let moduleDefinition: IModuleRepositoryItem | undefined;

      // if (resultGitClone.success) {
      //   moduleDefinition = await this.moduleLoader.loadModule(folderName);
      //   if (moduleDefinition) {
      //     this.moduleRepository.add(moduleDefinition);
      //   }
      // }

      return moduleDefinition;
    });
  }

  public updateAll(): Promise<ICommandResult> {
    return command('updateAll', undefined, async (result) => {
      const result1 = await SystemCommand.run('npm update', this.modulesRootPath);
      result.children.push(result1);
      const result2 = await SystemCommand.run('npm audit fix', this.modulesRootPath);
      result.children.push(result2);
      const result3 = await command('refreshModules', undefined, async () => {
        this.moduleRepository.getAll().forEach(m => this.moduleLoader.refreshModule(m));
      });
      result.children.push(result3);
    });

    // const moduleRepositoryItems = BackendService.instance.moduleManager.getAll().filter(x => x.hasUpdate);
    // const results: ICommandResult[] = [];
    // for (const moduleRepositoryItem of moduleRepositoryItems) {
    //   const resultUpdate = await BackendService.instance.moduleManager.update(moduleRepositoryItem);
    //   results.push(resultUpdate);
    // }
    // return [];
  }

  public update(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult> {
    return command('update', moduleDefinition && moduleDefinition.name, async () => {
      if (!moduleDefinition) {
        throw new Error('Can not update module');
      }

      let updateResult: ICommandResult;
      if (moduleDefinition.type === 'npm') {
        updateResult = await SystemCommand.run('npm install --save ' + moduleDefinition.name + '@' + moduleDefinition.updateVersion, this.modulesRootPath);
      } else {
        updateResult = await SystemCommand.run('npm update ' + moduleDefinition.name, this.modulesRootPath);
      }

      if (updateResult.success) {
        moduleDefinition.hasUpdate = false;
        this.moduleLoader.refreshModule(moduleDefinition);
      }

      return updateResult;
      // return await SystemCommand.run('git fetch --all && git reset --hard origin/master', moduleDefinition.path);
    });
  }

  // public install(moduleDefinition: IModuleRepositoryItem, propdOnly: boolean): Promise<ICommandResult> {
  //   return command('install', moduleDefinition && moduleDefinition.name, async () => {
  //     if (!moduleDefinition || !moduleDefinition.canInstall) {
  //       throw new Error('Can not install module');
  //     }

  //     const commandArgs = propdOnly ? ' --production' : '';
  //     const result = await SystemCommand.run('npm install' + commandArgs, moduleDefinition.path);
  //     moduleDefinition.isInstalled = moduleDefinition.isInstalled || result.success;
  //     return result;
  //   });
  // }

  // public build(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult> {
  //   return command('build', moduleDefinition && moduleDefinition.name, async () => {
  //     if (!moduleDefinition || !moduleDefinition.canBuild) {
  //       throw new Error('Can not build module');
  //     }

  //     const result = await SystemCommand.run('npm run build', moduleDefinition.path);
  //     moduleDefinition.isBuilded = moduleDefinition.isBuilded || result.success;
  //     return result;
  //   });
  // }

  public remove(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult> {
    return command('remove', moduleDefinition && moduleDefinition.name, async () => {
      if (!moduleDefinition || !moduleDefinition.canRemove) {
        throw new Error('Can not remove module');
      }

      const result = await SystemCommand.run('npm un ' + moduleDefinition.name, this.modulesRootPath);
      if (result.success) {
        this.moduleRepository.remove(moduleDefinition.name);
      }
      return result;
      // this.moduleRepository.remove(moduleDefinition.name);
      // return SystemCommand.run('rimraf ' + moduleDefinition.path, this.modulesRootPath);
    });
  }

  public checkUpdates(): Promise<ICommandResultWithData<string[]>> {
    return command<string[]>('checkUpdates', undefined, async (result) => {
      const modulesWithUpdate: string[] = [];
      const modules = this.moduleRepository.getAll();
      for (const item of modules) {
        const resultHasUpdate = await this.hasUpdate(item);
        result.children.push(resultHasUpdate);
        if (item.hasUpdate) {
          modulesWithUpdate.push(item.name);
        }
      }

      return modulesWithUpdate;
    });
  }

  private hasUpdate(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResultWithData<boolean>> {
    return command<boolean>('checkUpdate', moduleDefinition && moduleDefinition.name, async (result) => {
      if (!moduleDefinition || !moduleDefinition.name) {
        throw new Error('Invalid module definition');
      }

      if (moduleDefinition.type === 'npm') {
        const npmViewVersionResult = await SystemCommand.run('npm view ' + moduleDefinition.name + ' version', this.modulesRootPath);
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
      } else if (moduleDefinition.type === 'git') {
        const packagePath = path.join(moduleDefinition.path, 'package.json');
        const packageJson = ModuleLoader.loadPackageJson(packagePath);
        let localHash = packageJson && packageJson._resolved && packageJson._resolved;
        if (localHash && localHash.length > 40) {
          localHash = localHash.substr(localHash.length - 40); // get SHA-1 from git url

          const gitRemoteResult = await SystemCommand.run('git ls-remote ' + moduleDefinition.repository, this.modulesRootPath);
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
      // const result1 = await SystemCommand.run('git remote -v update', moduleDefinition.path);
      // result.children.push(result1);
      // if (result1.success === false) {
      //   return false;
      // }

      // const result2 = await SystemCommand.run('git rev-list HEAD...origin/master --count', moduleDefinition.path);
      // result.children.push(result2);
      // if (result2.success === false) {
      //   return false;
      // }

      // return result2.log[0] !== '0';
    });
  }

  // private isDirEmpty(dirname: string): boolean {
  //   try {
  //     const files = fs.readdirSync(dirname);
  //     return !files.length;
  //   } catch (error) {
  //     return true;
  //   }
  // }
}