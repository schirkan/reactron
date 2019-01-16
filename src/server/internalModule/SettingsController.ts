import { IReactronService } from '@schirkan/reactron-interfaces';
import { routes } from '../../common/apiRoutes';
import { ReactronServiceContext } from '../ReactronServiceContext';

export class SettingsController implements IReactronService {
  public async start(context: ReactronServiceContext): Promise<void> {
    context.registerRoute(routes.getSettings, async (req, res) => {
      const result = await context.backendService.settings.get();
      res.send(result);
    });

    context.registerRoute(routes.setSettings, async (req, res) => {
      context.backendService.settings.set(req.body);
      res.sendStatus(204);
    });
  }
}