import { IModuleController, IAppController, ILogController, IServiceController, IWebComponentController, IWebPageController, ISystemSettings, IWebPageOptions, IWebComponentOptions, IReactronServices } from '@schirkan/reactron-interfaces';
import { createRemoteService } from './RpcClient';

export class ReactronServicesFrontend implements IReactronServices {
  private moduleController = createRemoteService<IModuleController>('ModuleController', 'reactron');
  private appController = createRemoteService<IAppController>('AppController', 'reactron');
  private logController = createRemoteService<ILogController>('LogController', 'reactron');
  private serviceController = createRemoteService<IServiceController>('ServiceController', 'reactron');
  private webComponentController = createRemoteService<IWebComponentController>('WebComponentController', 'reactron');
  private webPageController = createRemoteService<IWebPageController>('WebPageController', 'reactron');

  private _modulesCache: any;
  private _settingsCache: any;
  private _servicesCache: any;
  private _serviceOptionsCache: { [key: string]: any } = {};
  private _pagesCache: any;
  private _componentsCache: any;

  public clearCache(): void {
    delete this._modulesCache;
    delete this._settingsCache;
    delete this._servicesCache;
    this._serviceOptionsCache = {};
    delete this._pagesCache;
    delete this._componentsCache;
  }

  public readonly modules: IModuleController = {
    getAll: () => {
      return this._modulesCache || (this._modulesCache = this.moduleController.getAll());
    },
    add: (repository: string) => {
      delete this._modulesCache;
      return this.moduleController.add(repository);
    },
    remove: (moduleName: string) => {
      delete this._modulesCache;
      return this.moduleController.remove(moduleName);
    },
    update: (moduleName: string) => {
      delete this._modulesCache;
      return this.moduleController.update(moduleName);
    },
    updateAll: () => {
      delete this._modulesCache;
      return this.moduleController.updateAll();
    },
    checkUpdates: this.moduleController.checkUpdates,
  };

  public readonly application: IAppController = {
    getServerInfo: this.appController.getServerInfo, // TODO: cache
    exitApplication: this.appController.exitApplication,
    restartApplication: this.appController.restartApplication,
    shutdownSystem: this.appController.shutdownSystem,
    rebootSystem: this.appController.rebootSystem,
    resetApplication: this.appController.resetApplication,
    getSettings: () => {
      return this._settingsCache || (this._settingsCache = this.appController.getSettings());
    },
    setSettings: (settings: ISystemSettings) => {
      this._settingsCache = settings;
      return this.appController.setSettings(settings);
    },
  };

  public readonly log: ILogController = {
    getLogEntries: this.logController.getLogEntries
  };

  public readonly services: IServiceController = {
    getAllServices: () => {
      return this._servicesCache || (this._servicesCache = this.serviceController.getAllServices());
    },
    getServiceOptions: (moduleName: string, serviceName: string) => {
      const key = moduleName + '.' + serviceName;
      return this._serviceOptionsCache[key] || (this._serviceOptionsCache[key] = this.serviceController.getServiceOptions(moduleName, serviceName));
    },
    setServiceOptions: (moduleName: string, serviceName: string, options: object) => {
      const key = moduleName + '.' + serviceName;
      this._serviceOptionsCache[key] = options;
      return this.serviceController.setServiceOptions(moduleName, serviceName, options);
    },
  };

  public readonly components: IWebComponentController = {
    getAll: () => {
      return this._componentsCache || (this._componentsCache = this.webComponentController.getAll());
    },
    createOrUpdate: (options: IWebComponentOptions) => {
      delete this._componentsCache;
      return this.webComponentController.createOrUpdate(options);
    },
    delete: (id: string) => {
      delete this._componentsCache;
      return this.webComponentController.delete(id);
    },
  }

  public readonly pages: IWebPageController = {
    getAll: () => {
      return this._pagesCache || (this._pagesCache = this.webPageController.getAll());
    },
    createOrUpdate: (options: IWebPageOptions) => {
      delete this._pagesCache;
      return this.webPageController.createOrUpdate(options);
    },
    delete: (id: string) => {
      delete this._pagesCache;
      return this.webPageController.delete(id);
    },
  };
}

export const services: ReactronServicesFrontend = new ReactronServicesFrontend();