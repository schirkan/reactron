import { Request, Response, Router } from 'express';
import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';

export class ServiceController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('ServiceController.start');
        const router = Router();
        helper.moduleApiRouter.use('/service', router);

        router.get('/:moduleName/:serviceName', async (req: Request, res: Response) => {
            console.log('ServiceController.get');
            const result = await helper.backendService.serviceManager.get(req.params.moduleName, req.params.serviceName);
            res.json(result);
        });

        router.post('/:moduleName/:serviceName/start', async (req: Request, res: Response) => {
            console.log('ServiceController.start');
            // TODO
            res.send();
        });

        router.post('/:moduleName/:serviceName/stop', async (req: Request, res: Response) => {
            console.log('ServiceController.stop');
            // TODO
            res.send();
        });
    }
}