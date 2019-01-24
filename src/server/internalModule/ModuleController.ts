import { ICommandResult, IModuleController } from '@schirkan/reactron-interfaces';
import { BackendService } from '../BackendService';

export class ModuleController implements IModuleController {
  public async start(): Promise<void> { }

  public async getModules() {
    return BackendService.instance.moduleManager.getAll();
  }

  public async addModule(repository: string) {
    const results: ICommandResult[] = [];
    const resultAdd = await BackendService.instance.moduleManager.add(repository);
    results.push(resultAdd);

    if (resultAdd.success && resultAdd.data) {
      const moduleRepositoryItem = resultAdd.data;

      if (moduleRepositoryItem.isBuilded) {
        const resultInstall = await BackendService.instance.moduleManager.install(moduleRepositoryItem, true);
        results.push(resultInstall);
      } else {
        const resultInstall = await BackendService.instance.moduleManager.install(moduleRepositoryItem, false);
        results.push(resultInstall);
        const resultBuild = await BackendService.instance.moduleManager.build(moduleRepositoryItem);
        results.push(resultBuild);
      }
    }
    return results;
  }

  public async deleteModule(moduleName: string): Promise<ICommandResult[]> {
    const moduleRepositoryItem = BackendService.instance.moduleManager.get(moduleName);
    if (moduleRepositoryItem) {
      const result = await BackendService.instance.moduleManager.remove(moduleRepositoryItem);
      return [result];
    } else {
      throw new Error('not found');
    }
  }

  public async rebuildModule(moduleName: string): Promise<ICommandResult[]> {
    const moduleRepositoryItem = BackendService.instance.moduleManager.get(moduleName);
    if (moduleRepositoryItem) {
      const resultInstall = await BackendService.instance.moduleManager.install(moduleRepositoryItem, false);
      const resultBuild = await BackendService.instance.moduleManager.build(moduleRepositoryItem);
      return [resultInstall, resultBuild];
    } else {
      throw new Error('not found');
    }
  }

  public async updateModule(moduleName: string): Promise<ICommandResult[]> {
    const moduleRepositoryItem = BackendService.instance.moduleManager.get(moduleName);
    if (moduleRepositoryItem) {
      const results: ICommandResult[] = [];
      if (moduleRepositoryItem.hasUpdate) {
        const resultUpdate = await BackendService.instance.moduleManager.update(moduleRepositoryItem);
        results.push(resultUpdate);

        if (moduleRepositoryItem.isBuilded) {
          const resultInstall = await BackendService.instance.moduleManager.install(moduleRepositoryItem, true);
          results.push(resultInstall);
        } else {
          const resultInstall = await BackendService.instance.moduleManager.install(moduleRepositoryItem, false);
          results.push(resultInstall);
          const resultBuild = await BackendService.instance.moduleManager.build(moduleRepositoryItem);
          results.push(resultBuild);
        }
      }
      return results;
    } else {
      throw new Error('not found');
    }
  }

  public async checkUpdates(): Promise<ICommandResult[]> {
    const resultCheckUpdates = await BackendService.instance.moduleManager.checkUpdates();
    return [resultCheckUpdates];
  }
}