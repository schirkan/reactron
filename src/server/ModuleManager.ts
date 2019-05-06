import { IBackendServiceConfig, ICommandResult, ICommandResultWithData, IModuleRepositoryItem } from '@schirkan/reactron-interfaces';
import * as path from 'path';
import { command } from './commandResultWrapper';
import { ModuleRepository } from "./ModuleRepository";
import { SystemCommand } from "./SystemCommand";
import { IModuleHandler } from './moduleHandler/IModuleHandler';
import { NpmModuleHandler } from './moduleHandler/NpmModuleHandler';
import { LocalModuleHandler } from './moduleHandler/LocalModuleHandler';
import { refreshModule } from './ModuleHelper';

export class ModuleManager {
  private modulesRootPath: string;
  public npmModuleHandler: NpmModuleHandler;
  public localModuleHandler: LocalModuleHandler;
  public moduleHandler: IModuleHandler[];

  constructor(
    private config: IBackendServiceConfig,
    private moduleRepository: ModuleRepository,
  ) {
    this.localModuleHandler = new LocalModuleHandler(config, moduleRepository);
    this.npmModuleHandler = new NpmModuleHandler(config, moduleRepository);
    this.moduleHandler = [this.npmModuleHandler, this.localModuleHandler];
    this.modulesRootPath = path.join(this.config.root, 'modules');
  }

  public loadAllModules(): void {
    this.moduleHandler.forEach(handler => {
      const modules = handler.loadAllModules();
      modules.forEach(this.moduleRepository.add);
    });
  }

  public getAll(): IModuleRepositoryItem[] {
    return this.moduleRepository.getAll();
  }

  public get(moduleName: string): IModuleRepositoryItem | undefined {
    return this.moduleRepository.get(moduleName);
  }

  private async findAddHandler(repository: string): Promise<IModuleHandler | undefined> {
    const handlerPromise = this.moduleHandler.map(async x => await x.canAdd(repository) ? x : undefined);
    return Promise.all(handlerPromise).then(handler => handler.find(x => !!x));
  }

  private async findUpdateHandler(moduleDefinition: IModuleRepositoryItem): Promise<IModuleHandler | undefined> {
    const handlerPromise = this.moduleHandler.map(async x => await x.canUpdate(moduleDefinition) ? x : undefined);
    return Promise.all(handlerPromise).then(handler => handler.find(x => !!x));
  }

  private async findRemoveHandler(moduleDefinition: IModuleRepositoryItem): Promise<IModuleHandler | undefined> {
    const handlerPromise = this.moduleHandler.map(async x => await x.canRemove(moduleDefinition) ? x : undefined);
    return Promise.all(handlerPromise).then(handler => handler.find(x => !!x));
  }

  public async add(repository: string): Promise<ICommandResultWithData<IModuleRepositoryItem | undefined>> {
    const handler = await this.findAddHandler(repository);
    if (!handler) {
      throw new Error('No AddHandler for this repository.');
    }
    return handler.add(repository);
  }

  public updateAll(): Promise<ICommandResult> {
    return command('updateAll', undefined, async (result) => {
      const result1 = await SystemCommand.run('npm update', this.modulesRootPath);
      result.children.push(result1);
      const result2 = await SystemCommand.run('npm audit fix', this.modulesRootPath);
      result.children.push(result2);
      const result3 = await command('refreshModules', undefined, async () => {
        this.moduleRepository.getAll().forEach(m => refreshModule(m));
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

      const handler = await this.findUpdateHandler(moduleDefinition);
      if (!handler) {
        throw new Error('No UpdateHandler for this module.');
      }
      return handler.update(moduleDefinition);
    });
  }


  public remove(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult> {
    return command('remove', moduleDefinition && moduleDefinition.name, async () => {
      if (!moduleDefinition || !moduleDefinition.canRemove) {
        throw new Error('Can not remove module');
      }

      const handler = await this.findRemoveHandler(moduleDefinition);
      if (!handler) {
        throw new Error('No RemoveHandler for this module.');
      }
      return handler.remove(moduleDefinition);
    });
  }

  public checkUpdates(): Promise<ICommandResultWithData<string[]>> {
    return command<string[]>('checkUpdates', undefined, async (result) => {
      const modulesWithUpdate: string[] = [];
      const modules = this.moduleRepository.getAll();
      for (const moduleDefinition of modules) {
        const handler = await this.findUpdateHandler(moduleDefinition);
        if (handler) {
          const resultHasUpdate = await handler.hasUpdate(moduleDefinition);
          result.children.push(resultHasUpdate);
          moduleDefinition.hasUpdate = resultHasUpdate.data;
          if (moduleDefinition.hasUpdate) {
            modulesWithUpdate.push(moduleDefinition.name);
          }
        } else {
          moduleDefinition.hasUpdate = false;
        }
      }

      return modulesWithUpdate;
    });
  }
}