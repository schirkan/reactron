import { IReactronServiceContext, ISystemSettings, ElectronStore, ILogWriter, IReactronServices, IPubSub } from '@schirkan/reactron-interfaces';
import * as express from 'express';
import { BackendService } from './BackendService';
import { LogWriter } from './../common/LogWriter';
import { ReactronServicesBackend } from './ReactronServicesBackend';

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class ReactronServiceContext implements IReactronServiceContext {
  private moduleContext: InternalModuleContext;
  public readonly log: ILogWriter;

  constructor(public moduleName: string, public serviceName: string) {
    this.moduleContext = InternalModuleContext.getModuleContext(this.moduleName);
    this.log = new LogWriter(BackendService.instance.topics, moduleName + '.' + serviceName);
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
    return ReactronServicesBackend.instance;
  }

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
  public readonly moduleApiRouter: express.Router;

  constructor(public moduleName: string) {
    this.moduleStorage = new Store({ name: 'module.' + moduleName });
    this.moduleApiRouter = express.Router();
    const escapedModuleName = moduleName.replace('/', '@');
    BackendService.instance.expressApp.apiRouter.use('/' + escapedModuleName, this.moduleApiRouter);
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