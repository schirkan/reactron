import { routes } from '../../common/apiRoutes';
import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';
import { registerRoute } from './registerRoute';

export class SettingsController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('SettingsController.start');

        registerRoute(helper.moduleApiRouter, routes.getSettings, async (req, res) => {
            console.log('SettingsController.get');
            const result = await helper.backendService.settings.get();
            res.send(result);
        });
        
        registerRoute(helper.moduleApiRouter, routes.setSettings, async (req, res) => {
            console.log('SettingsController.set');
            helper.backendService.settings.set(req.body);
            res.sendStatus(201);
            // TODO: ex handling
        });
    }
}