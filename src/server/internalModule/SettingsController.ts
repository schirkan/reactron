import { Request, Response, Router } from 'express';
import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';

export class SettingsController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('SettingsController.start');
        const router = Router();
        helper.moduleApiRouter.use('/service', router);

        router.get('/', async (req: Request, res: Response) => {
            console.log('SettingsController.get');
            const result = await helper.backendService.settings.get();
            res.send(result);
        });
        
        router.post('/', async (req: Request, res: Response) => {
            console.log('SettingsController.set');
            helper.backendService.settings.set(req.body);
            res.send();
            // TODO: ex handling
        });
    }
}