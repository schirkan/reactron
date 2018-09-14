import { routes } from '../../common/apiRoutes';
import { IExternalService } from '../../interfaces/IExternalService';
import { IServerInfo } from '../../interfaces/IServerInfo';
import { ServerModuleHelper } from '../ServerModuleHelper';
import { registerRoute } from './registerRoute';

// tslint:disable-next-line:no-var-requires
const os = require('electron-shutdown-command');

export class AppController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('AppController.start');

        registerRoute(helper.moduleApiRouter, routes.getServerInfo, async (req, res) => {
            console.log('AppController.getServerInfo');
            const result: IServerInfo = {
                ip: '',
                cpu: '',
                memory: ''
            };
            res.send(result);
        });

        registerRoute(helper.moduleApiRouter, routes.exitApplication, async (req, res) => {
            console.log('AppController.exitApplication');
            res.sendStatus(204);
            helper.backendService.exit();
        });

        registerRoute(helper.moduleApiRouter, routes.restartApplication, async (req, res) => {
            console.log('AppController.restartApplication');
            res.sendStatus(204);
            helper.backendService.restart();
        });

        registerRoute(helper.moduleApiRouter, routes.shutdownSystem, async (req, res) => {
            console.log('AppController.shutdownSystem');
            res.sendStatus(204);
            os.shutdown({ quitapp: true });
        });

        registerRoute(helper.moduleApiRouter, routes.restartSystem, async (req, res) => {
            console.log('AppController.restartSystem');
            res.sendStatus(204);
            os.restart({ quitapp: true });
        });

        registerRoute(helper.moduleApiRouter, routes.resetApplication, async (req, res) => {
            console.log('AppController.resetApplication');
            res.sendStatus(204);
            helper.backendService.reset();
        });
    }
}