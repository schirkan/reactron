import { routes } from '../../common/apiRoutes';
import { IExternalService } from '../../interfaces/IExternalService';
import { IServiceRepositoryItem } from '../../interfaces/IServiceRepositoryItem';
import { ServerModuleHelper } from '../ServerModuleHelper';
import { registerRoute } from './registerRoute';

export class ServiceController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('ServiceController.start');

        registerRoute(helper.moduleApiRouter, routes.getServices, async (req, res) => {
            console.log('ServiceController.getAll');
            const result = await helper.backendService.serviceRepository.getAll();
            const serviceInfos = result.map(item => {
                const { instance, service, ...serviceInfo } = item;
                return serviceInfo as IServiceRepositoryItem;
            });
            res.send(serviceInfos);
        });

        registerRoute(helper.moduleApiRouter, routes.getServiceOptions, async (req, res) => {
            console.log('ServiceController.getServiceOptions');
            const result = helper.backendService.serviceOptionsRepository.get(req.params.moduleName, req.params.serviceName);
            res.send(result);
        });

        registerRoute(helper.moduleApiRouter, routes.setServiceOptions, async (req, res) => {
            console.log('ServiceController.setServiceOptions');
            helper.backendService.serviceOptionsRepository.set(req.params.moduleName, req.params.serviceName, req.body);
            await helper.backendService.serviceManager.setOptions(req.params.moduleName, req.params.serviceName, req.body);
            res.sendStatus(204);
            // TODO: ex handling
        });
    }
}