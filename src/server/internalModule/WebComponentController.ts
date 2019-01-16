import { IReactronService } from '@schirkan/reactron-interfaces';
import { routes } from '../../common/apiRoutes';
import { ReactronServiceContext } from '../ReactronServiceContext';

export class WebComponentController implements IReactronService {
  public async start(context: ReactronServiceContext): Promise<void> {
    context.registerRoute(routes.getWebComponentOptions, async (req, res) => {
      const result = context.backendService.webComponentsManager.getAll();
      res.send(result);
    });

    context.registerRoute(routes.setWebComponentOptions, async (req, res) => {
      const item = context.backendService.webComponentsManager.createOrUpdate(req.body);
      res.send(item);
    });

    context.registerRoute(routes.deleteWebComponentOptions, async (req, res) => {
      context.backendService.webComponentsManager.remove(req.params.id);
      res.sendStatus(204);
    });
  }
}