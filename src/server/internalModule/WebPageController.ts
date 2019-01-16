import { IReactronService } from '@schirkan/reactron-interfaces';
import { routes } from '../../common/apiRoutes';
import { ReactronServiceContext } from '../ReactronServiceContext';

export class WebPageController implements IReactronService {
  public async start(context: ReactronServiceContext): Promise<void> {
    context.registerRoute(routes.getWebPages, async (req, res) => {
      const result = context.backendService.webPageManager.getAll();
      res.send(result);
    });

    context.registerRoute(routes.setWebPage, async (req, res) => {
      const item = context.backendService.webPageManager.createOrUpdate(req.body);
      res.send(item);
    });

    context.registerRoute(routes.deleteWebPage, async (req, res) => {
      context.backendService.webPageManager.remove(req.params.id);
      res.sendStatus(204);
    });
  }
}