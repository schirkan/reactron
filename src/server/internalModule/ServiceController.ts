import { IServiceRepositoryItem, IServiceController, IReactronServiceContext } from '@schirkan/reactron-interfaces';
import { routes, ApiRoute } from '../../common/apiRoutes';
import { BackendService } from '../BackendService';
import * as express from 'express';

export class ServiceController implements IServiceController {
  constructor(private context: IReactronServiceContext) { }

  public async getAllServices(): Promise<IServiceRepositoryItem[]> {
    const result = await BackendService.instance.serviceRepository.getAll();
    const serviceInfos = result.map(item => {
      const { instance, service, context, ...serviceInfo } = item;
      return serviceInfo as IServiceRepositoryItem;
    });
    return serviceInfos
  }

  public async getServiceOptions(moduleName: string, serviceName: string): Promise<any> {
    return BackendService.instance.serviceOptionsRepository.get(moduleName, serviceName);
  }

  public async setServiceOptions(moduleName: string, serviceName: string, options: object): Promise<void> {
    return await BackendService.instance.serviceManager.setOptions(moduleName, serviceName, options);
  }

  public async start(): Promise<void> {
    this.registerRoute(routes.callServiceMethod, async (req, res) => {
      const service = BackendService.instance.serviceManager.get(req.body.moduleName, req.body.serviceName);
      let method = service && service[req.body.methodName];
      // TODO
      // console.log('callServiceMethod', req.body.args);
      if (!method) {
        res.sendStatus(404);
      } else {
        try {
          method = method.bind(service);
          const result = await Promise.resolve(method(...req.body.args));
          res.send({ result });
        } catch (error) {
          res.send({ error: error && error.message || error });
        }
      }
    });
  }

  private registerRoute = <TParams, TBody, TResponse>(
    route: ApiRoute<TParams, TBody, TResponse>,
    handler: RouteHandler<TParams, TBody, TResponse>
  ): void => {
    this.context.log.debug('Register route: ' + route.method + ' ' + route.path);
    const router = this.context.moduleApiRouter;
    const method = router[route.method.toLowerCase()].bind(router);
    const internalHandler: RouteHandler<TParams, TBody, TResponse> = async (req, res, next) => {
      try {
        let data: any = undefined;
        if (req.params && Object.keys(req.params).length) {
          data = req.params;
        }
        this.context.log.debug('Call route: ' + route.method + ' ' + route.path, data);
        await handler(req, res, next);
      } catch (error) {
        this.context.log.error('Error in route: ' + route.method + ' ' + route.path, error && error.message || error);
      }
    };
    method(route.path, internalHandler);
  };
}

type RouteHandler<TParams, TBody, TResponse> = (req: { params: TParams, body: TBody }, res: express.Response & { send: (body?: TResponse) => void }, next: express.NextFunction) => void | Promise<void>;
