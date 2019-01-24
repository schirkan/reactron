import { IReactronServiceContext, ISystemSettings, ElectronStore, ILogWriter, IBackendService, IReactronServices, IPubSub, IModuleController, IAppController, ILogController, IServiceController, IWebComponentController, IWebPageController } from '@schirkan/reactron-interfaces';
import * as express from 'express';
import { BackendService } from './BackendService';
import { LogWriter } from './../common/LogWriter';

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

class ReactronServices implements IReactronServices {
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

  public static instance = new ReactronServices();
}

export class ReactronServiceContext implements IReactronServiceContext {
  private moduleContext: InternalModuleContext;
  public readonly log: ILogWriter;

  constructor(public moduleName: string, public serviceName: string) {
    this.moduleContext = InternalModuleContext.getModuleContext(this.moduleName);
    this.log = new LogWriter(BackendService.instance.topics, moduleName + '.' + serviceName);
    // this.log.debug('Module Api Path: ' + this.moduleContext.moduleApiPath);
  }

  public get moduleStorage(): ElectronStore {
    return this.moduleContext.moduleStorage;
  }

  public get moduleApiRouter(): express.Router {
    return this.moduleContext.moduleApiRouter;
  }

  public get topics(): Readonly<IPubSub> {
    return BackendService.instance.topics;
  }

  public get settings(): Readonly<ISystemSettings> {
    return BackendService.instance.settings.get();
  }

  public get services(): IReactronServices {
    return ReactronServices.instance
  };

  public async getService<TService = any>(serviceName: string, moduleName?: string): Promise<TService | undefined> {
    return await BackendService.instance.serviceManager.getAsync(moduleName || this.moduleName, serviceName) as unknown as TService | undefined;
  }

  private static serviceContexts: ReactronServiceContext[] = [];

  public static getServiceContext(moduleName: string, serviceName: string) {
    let context = ReactronServiceContext.serviceContexts.find(x => x.moduleName === moduleName && x.serviceName === serviceName);
    if (!context) {
      context = new ReactronServiceContext(moduleName, serviceName);
      ReactronServiceContext.serviceContexts.push(context);
    }
    return context;
  }
}

class InternalModuleContext {
  public readonly moduleStorage: ElectronStore;
  public readonly moduleApiPath: string;
  public readonly moduleApiRouter: express.Router;

  constructor(public moduleName: string) {
    this.moduleStorage = new Store({ name: 'module.' + moduleName });
    this.moduleApiRouter = express.Router();

    const escapedModuleName = moduleName.replace('/', '@');
    this.moduleApiPath = '/modules/' + escapedModuleName;

    BackendService.instance.expressApp.apiRouter.use(this.moduleApiPath, this.moduleApiRouter);
  }

  private static moduleContexts: InternalModuleContext[] = [];

  public static getModuleContext(moduleName: string) {
    let context = InternalModuleContext.moduleContexts.find(x => x.moduleName === moduleName);
    if (!context) {
      context = new InternalModuleContext(moduleName);
      InternalModuleContext.moduleContexts.push(context);
    }
    return context;
  }
}