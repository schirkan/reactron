import { IReactronService, IServiceRepositoryItem } from '@schirkan/reactron-interfaces';
import { routes } from '../../common/apiRoutes';
import { ReactronServiceContext } from '../ReactronServiceContext';

export class ServiceController implements IReactronService {
  public async start(context: ReactronServiceContext): Promise<void> {
    context.registerRoute(routes.getServices, async (req, res) => {
      const result = await context.backendService.serviceRepository.getAll();
      const serviceInfos = result.map(item => {
        const { instance, service, context, ...serviceInfo } = item;
        return serviceInfo as IServiceRepositoryItem;
      });
      res.send(serviceInfos);
    });

    context.registerRoute(routes.getServiceOptions, async (req, res) => {
      const result = context.backendService.serviceOptionsRepository.get(req.body.moduleName, req.body.serviceName);
      res.send(result);
    });

    context.registerRoute(routes.setServiceOptions, async (req, res) => {
      await context.backendService.serviceManager.setOptions(req.body.moduleName, req.body.serviceName, req.body.options);
      res.sendStatus(204);
    });

    context.registerRoute(routes.callServiceMethod, async (req, res) => {
      const service = context.backendService.serviceManager.get(req.body.moduleName, req.body.serviceName);
      let method = service && service[req.body.methodName];

      console.log('callServiceMethod', req.body.args);

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
}