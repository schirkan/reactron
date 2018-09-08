import { Request, Response, Router } from 'express';
import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';

export class WebPageController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('WebPageController.start');
        const router = Router();
        helper.moduleApiRouter.use('/pages', router);

        router.get('/', (req: Request, res: Response) => {
            console.log('WebPageController.getAll');
            const result = helper.backendService.webPageManager.getAll();
            res.send(result);
        });
        
        router.post('/', (req: Request, res: Response) => {
            console.log('WebPageController.createOrUpdate');
            helper.backendService.webPageManager.createOrUpdate(req.body);
            res.sendStatus(201);
        });
        
        router.delete('/:path', (req: Request, res: Response) => {
            console.log('WebPageController.remove');
            helper.backendService.webPageManager.remove(req.params.path);
            res.sendStatus(201);
        });
    }
}