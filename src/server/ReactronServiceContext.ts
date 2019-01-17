import { IReactronServiceContext, ISystemSettings, ElectronStore, ILogWriter, IBackendService, IModuleContext } from '@schirkan/reactron-interfaces';
import * as express from 'express';
import { BackendService } from './BackendService';
import { LogWriter } from './../common/LogWriter';
import { ApiRoute } from '../common/apiRoutes';

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

type RouteHandler<TParams, TBody, TResponse> = (req: { params: TParams, body: TBody }, res: express.Response & { send: (body?: TResponse) => void }, next: express.NextFunction) => void | Promise<void>;

export class ReactronServiceContext implements IReactronServiceContext {
  private moduleContext: InternalModuleContext;
  public readonly backendService: BackendService = BackendService.instance;
  public readonly log: ILogWriter;

  constructor(public moduleName: string, public serviceName: string) {
    this.moduleContext = InternalModuleContext.getModuleContext(this.backendService, this.moduleName);
    this.log = new LogWriter(this.backendService.topics, moduleName + '.' + serviceName);
    // this.log.debug('Module Api Path: ' + this.moduleContext.moduleApiPath);
  }

  public get moduleStorage(): ElectronStore {
    return this.moduleContext.moduleStorage;
  }

  public get moduleApiRouter(): express.Router{
    return this.moduleContext.moduleApiRouter;
  }

  public get settings(): Readonly<ISystemSettings> {
    return this.backendService.settings.get();
  }

  public getService<TService = any>(serviceName: string, moduleName?: string): TService | undefined {
    return this.backendService.serviceManager.get(moduleName || this.moduleName, serviceName) as unknown as TService | undefined;
  }

  public async getServiceAsync<TService = any>(serviceName: string, moduleName?: string): Promise<TService | undefined> {
    return await this.backendService.serviceManager.getAsync(moduleName || this.moduleName, serviceName) as unknown as TService | undefined;
  }

  public registerRoute = <TParams, TBody, TResponse>(
    route: ApiRoute<TParams, TBody, TResponse>,
    handler: RouteHandler<TParams, TBody, TResponse>
  ): void => {
    this.log.debug('Register route: ' + route.method + ' ' + route.path);
    const router = this.moduleApiRouter;
    const method = router[route.method.toLowerCase()].bind(router);
    const internalHandler: RouteHandler<TParams, TBody, TResponse> = async (req, res, next) => {
      try {
        this.log.debug('Call route: ' + route.method + ' ' + route.path);
        await handler(req, res, next);
      } catch (error) {
        this.log.error('Error in route: ' + route.method + ' ' + route.path, error);
      }
    };
    method(route.path, internalHandler);
  };

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

  constructor(backendService: IBackendService, public moduleName: string) {
    this.moduleStorage = new Store({ name: 'module.' + moduleName });
    this.moduleApiRouter = express.Router();

    const escapedModuleName = moduleName.replace('/', '@');
    this.moduleApiPath = '/modules/' + escapedModuleName;

    backendService.expressApp.apiRouter.use(this.moduleApiPath, this.moduleApiRouter);
  }

  private static moduleContexts: InternalModuleContext[] = [];

  public static getModuleContext(backendService: IBackendService, moduleName: string) {
    let context = InternalModuleContext.moduleContexts.find(x => x.moduleName === moduleName);
    if (!context) {
      context = new InternalModuleContext(backendService, moduleName);
      InternalModuleContext.moduleContexts.push(context);
    }
    return context;
  }
}