import { IReactronService } from '@schirkan/reactron-interfaces';
import { routes } from '../../common/apiRoutes';
import { ReactronServiceContext } from '../ReactronServiceContext';
import { registerRoute } from './registerRoute';

export class WebComponentController implements IReactronService {
    public async start(context: ReactronServiceContext): Promise<void> {
        console.log('WebComponentController.start');

        registerRoute(context.moduleApiRouter, routes.getWebComponentOptions, async (req, res) => {
            console.log('WebComponentController.getAll');
            const result = context.backendService.webComponentsManager.getAll();
            res.send(result);
        });
        
        registerRoute(context.moduleApiRouter, routes.setWebComponentOptions, async (req, res) => {
            console.log('WebComponentController.createOrUpdate');
            const item = context.backendService.webComponentsManager.createOrUpdate(req.body);
            res.send(item);
        });
        
        registerRoute(context.moduleApiRouter, routes.deleteWebComponentOptions, async (req, res) => {
            console.log('WebComponentController.remove');
            context.backendService.webComponentsManager.remove(req.params.id);
            res.sendStatus(204);
        });
    }
}