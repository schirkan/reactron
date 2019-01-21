import { IModuleController } from '../common/serviceInterfaces';
import { createRemoteService } from './RpcClient';

// TODO
export class FrontendService {
  private moduleController = createRemoteService<IModuleController>('ModuleController', 'reactron');
  private _modulesCache: any;

  public clearCache() {
    delete this._modulesCache;

  }

  public readonly modules: IModuleController = {
    getModules: () => {
      if (!this._modulesCache) {
        this._modulesCache = this.moduleController.getModules();
      }
      return this._modulesCache;
    },
    addModule: (repository: string) => {
      delete this._modulesCache;
      return this.moduleController.addModule(repository);
    },
    deleteModule: (moduleName: string) => {
      delete this._modulesCache;
      return this.moduleController.deleteModule(moduleName);
    },
    updateModule: (moduleName: string) => {
      delete this._modulesCache;
      return this.moduleController.updateModule(moduleName);
    },
    checkUpdates: this.moduleController.checkUpdates,
    rebuildModule: this.moduleController.rebuildModule,
  };

}

export const frontendService: FrontendService = new FrontendService();