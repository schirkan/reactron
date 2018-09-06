import { Request, Response, Router } from 'express';
import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';

export class WebComponentController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('WebComponentController.start');
        const router = Router();
        helper.moduleApiRouter.use('/components', router);

        router.get('/', (req: Request, res: Response) => {
            console.log('WebComponentController.getAll');
            const result = helper.backendService.webComponentsManager.getAll();
            res.json(result);
        });
        
        router.post('/', (req: Request, res: Response) => {
            console.log('WebComponentController.createOrUpdate');
            helper.backendService.webComponentsManager.createOrUpdate(req.body);
            res.sendStatus(201);
        });
        
        router.delete('/:id', (req: Request, res: Response) => {
            console.log('WebComponentController.remove');
            helper.backendService.webComponentsManager.remove(req.params.id);
            res.sendStatus(201);
        });
    }
}