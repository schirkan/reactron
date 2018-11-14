import { IReactronService } from '@schirkan/reactron-interfaces';
import { routes } from '../../common/apiRoutes';
import { ReactronServiceContext } from '../ReactronServiceContext';
import { registerRoute } from './registerRoute';

export class SettingsController implements IReactronService {
    public async start(context: ReactronServiceContext): Promise<void> {
        console.log('SettingsController.start');

        registerRoute(context.moduleApiRouter, routes.getSettings, async (req, res) => {
            console.log('SettingsController.get');
            const result = await context.backendService.settings.get();
            res.send(result);
        });
        
        registerRoute(context.moduleApiRouter, routes.setSettings, async (req, res) => {
            console.log('SettingsController.set');
            context.backendService.settings.set(req.body);
            res.sendStatus(204);
            // TODO: ex handling
        });
    }
}