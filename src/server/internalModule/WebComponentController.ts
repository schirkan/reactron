import { routes } from '../../common/apiRoutes';
import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';
import { registerRoute } from './registerRoute';

export class WebComponentController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('WebComponentController.start');

        registerRoute(helper.moduleApiRouter, routes.getWebComponentOptions, async (req, res) => {
            console.log('WebComponentController.getAll');
            const result = helper.backendService.webComponentsManager.getAll();
            res.send(result);
        });
        
        registerRoute(helper.moduleApiRouter, routes.setWebComponentOptions, async (req, res) => {
            console.log('WebComponentController.createOrUpdate');
            const item = helper.backendService.webComponentsManager.createOrUpdate(req.body);
            res.send(item);
        });
        
        registerRoute(helper.moduleApiRouter, routes.deleteWebComponentOptions, async (req, res) => {
            console.log('WebComponentController.remove');
            helper.backendService.webComponentsManager.remove(req.params.id);
            res.sendStatus(204);
        });
    }
}