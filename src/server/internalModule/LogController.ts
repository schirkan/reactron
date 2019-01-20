import { IReactronService } from '@schirkan/reactron-interfaces';
import { routes } from '../../common/apiRoutes';
import { ReactronServiceContext } from '../ReactronServiceContext';

export class LogController implements IReactronService {
  public async start(context: ReactronServiceContext): Promise<void> {
    context.registerRoute(routes.getLogEntries, async (req, res) => {
      const result = await context.backendService.logManager.readLog(req.body.source);
      res.send(result);
    });
  }
}