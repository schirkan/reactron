import { routes } from '../../common/apiRoutes';
import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';
import { registerRoute } from './registerRoute';

export class WebPageController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('WebPageController.start');

        registerRoute(helper.moduleApiRouter, routes.getWebPages, async (req, res) => {
            console.log('WebPageController.getAll');
            const result = helper.backendService.webPageManager.getAll();
            res.send(result);
        });
        
        registerRoute(helper.moduleApiRouter, routes.setWebPage, async (req, res) => {
            console.log('WebPageController.createOrUpdate');
            const item = helper.backendService.webPageManager.createOrUpdate(req.body);
            res.send(item);
        });
        
        registerRoute(helper.moduleApiRouter, routes.deleteWebPage, async (req, res) => {
            console.log('WebPageController.remove');
            helper.backendService.webPageManager.remove(req.params.id);
            res.sendStatus(204);
        });
    }
}