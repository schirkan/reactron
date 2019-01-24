import { IReactronServices, IModuleController, IAppController, ILogController, IServiceController, IWebComponentController, IWebPageController } from '@schirkan/reactron-interfaces';
import { BackendService } from './BackendService';

export class ReactronServicesBackend implements IReactronServices {
  public static instance = new ReactronServicesBackend();

  private _modules?: IModuleController;
  public get modules() {
    if (!this._modules) {
      this._modules = BackendService.instance.serviceManager.get('reactron', 'ModuleController') as IModuleController;
    }
    return this._modules;
  }

  private _application?: IAppController;
  public get application() {
    if (!this._application) {
      this._application = BackendService.instance.serviceManager.get('reactron', 'AppController') as IAppController;
    }
    return this._application;
  }

  private _log?: ILogController;
  public get log() {
    if (!this._log) {
      this._log = BackendService.instance.serviceManager.get('reactron', 'LogController') as ILogController;
    }
    return this._log;
  }

  private _services?: IServiceController;
  public get services() {
    if (!this._services) {
      this._services = BackendService.instance.serviceManager.get('reactron', 'ServiceController') as IServiceController;
    }
    return this._services;
  }

  private _components?: IWebComponentController;
  public get components() {
    if (!this._components) {
      this._components = BackendService.instance.serviceManager.get('reactron', 'WebComponentController') as IWebComponentController;
    }
    return this._components;
  }

  private _pages?: IWebPageController;
  public get pages() {
    if (!this._pages) {
      this._pages = BackendService.instance.serviceManager.get('reactron', 'WebPageController') as IWebPageController;
    }
    return this._pages;
  }
}
