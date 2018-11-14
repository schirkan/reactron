import { IReactronService } from '@schirkan/reactron-interfaces';
import { routes } from '../../common/apiRoutes';
import { ReactronServiceContext } from '../ReactronServiceContext';
import { registerRoute } from './registerRoute';

export class WebPageController implements IReactronService {
    public async start(context: ReactronServiceContext): Promise<void> {
        console.log('WebPageController.start');

        registerRoute(context.moduleApiRouter, routes.getWebPages, async (req, res) => {
            console.log('WebPageController.getAll');
            const result = context.backendService.webPageManager.getAll();
            res.send(result);
        });
        
        registerRoute(context.moduleApiRouter, routes.setWebPage, async (req, res) => {
            console.log('WebPageController.createOrUpdate');
            const item = context.backendService.webPageManager.createOrUpdate(req.body);
            res.send(item);
        });
        
        registerRoute(context.moduleApiRouter, routes.deleteWebPage, async (req, res) => {
            console.log('WebPageController.remove');
            context.backendService.webPageManager.remove(req.params.id);
            res.sendStatus(204);
        });
    }
}