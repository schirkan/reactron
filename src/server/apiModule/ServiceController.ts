import { Request, Response, Router } from 'express';
import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';

export class ServiceController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('ServiceController.start');
        const router = Router();
        helper.moduleApiRouter.use('/service', router);

        router.get('/', async (req: Request, res: Response) => {
            console.log('ServiceController.getAll');
            const result = await helper.backendService.serviceRepository.getAll();
            const serviceInfos = result.map(item => {
                const { instance, ...serviceInfo } = item;
                return serviceInfo;
            });

            res.json(serviceInfos);
        });

        // router.get('/:moduleName/:serviceName', async (req: Request, res: Response) => {
        //     console.log('ServiceController.get');
        //     const result = await helper.backendService.serviceRepository.get(req.params.moduleName, req.params.serviceName);
        //     if (result) {
        //         const { instance, ...serviceInfo } = result;
        //         res.json(serviceInfo);
        //     } else {
        //         res.sendStatus(404);
        //     }
        // });
        
        router.get('/:moduleName/:serviceName', (req: Request, res: Response) => {
            console.log('ServiceController.getServiceOptions');
            const result = helper.backendService.serviceOptionsRepository.get(req.params.moduleName, req.params.serviceName);
            res.json(result);
        });
        
        router.post('/:moduleName/:serviceName', async (req: Request, res: Response) => {
            console.log('ServiceController.setServiceOptions');
            helper.backendService.serviceOptionsRepository.set(req.params.moduleName, req.params.serviceName, req.body);
            helper.backendService.serviceManager.setOptions(req.params.moduleName, req.params.serviceName, req.body);
            res.send();
        });
    }
}