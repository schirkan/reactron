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
      const result = context.backendService.serviceOptionsRepository.get(req.params.moduleName, req.params.serviceName);
      res.send(result);
    });

    context.registerRoute(routes.setServiceOptions, async (req, res) => {
      await context.backendService.serviceManager.setOptions(req.params.moduleName, req.params.serviceName, req.body);
      res.sendStatus(204);
    });
  }
}