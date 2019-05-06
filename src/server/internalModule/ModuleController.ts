import { ICommandResult, IModuleController } from '@schirkan/reactron-interfaces';
import { BackendService } from '../BackendService';

export class ModuleController implements IModuleController {
  public async start(): Promise<void> { }

  public async getAll() {
    return BackendService.instance.moduleManager.getAll();
  }

  public async add(repository: string): Promise<ICommandResult[]> {
    const result = await BackendService.instance.moduleManager.add(repository);
    return [result];
  }

  public async remove(moduleName: string): Promise<ICommandResult[]> {
    const moduleRepositoryItem = BackendService.instance.moduleManager.get(moduleName);
    if (moduleRepositoryItem) {
      const result = await BackendService.instance.moduleManager.remove(moduleRepositoryItem);
      return [result];
    } else {
      throw new Error('not found');
    }
  }

  public async updateAll(): Promise<ICommandResult[]> {
    const resultUpdateAll = await BackendService.instance.moduleManager.updateAll();
    return [resultUpdateAll];
  }

  public async update(moduleName: string): Promise<ICommandResult[]> {
    const moduleRepositoryItem = BackendService.instance.moduleManager.get(moduleName);
    if (moduleRepositoryItem) {
      const results: ICommandResult[] = [];
      if (moduleRepositoryItem.hasUpdate) {
        const resultUpdate = await BackendService.instance.moduleManager.update(moduleRepositoryItem);
        results.push(resultUpdate);
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