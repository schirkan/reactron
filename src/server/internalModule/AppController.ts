import { routes } from '../../common/apiRoutes';
import { IExternalService } from '../../interfaces/IExternalService';
import { IServerInfo } from '../../interfaces/IServerInfo';
import { ServerModuleHelper } from '../ServerModuleHelper';
import { registerRoute } from './registerRoute';

export class AppController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('AppController.start');

        registerRoute(helper.moduleApiRouter, routes.getServerInfo, async (req, res) => {
            console.log('AppController.getServerInfo');
            const result:IServerInfo={
                ip: '',
                cpu: '',
                memory:''
            };
            res.send(result);
        });
        
        registerRoute(helper.moduleApiRouter, routes.restartApp, async (req, res) => {
            console.log('AppController.restartApp');
            helper.backendService.restart();
            res.sendStatus(201);
        });
        
        registerRoute(helper.moduleApiRouter, routes.exitApp, async (req, res) => {
            console.log('AppController.exitApp');
            helper.backendService.exit();
            res.sendStatus(201);
        });
    }
}