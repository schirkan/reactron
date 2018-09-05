import { Request, Response, Router } from 'express';
import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';

export class DashboardController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('DashboardController.start');
        const router = Router();
        helper.moduleApiRouter.use('/dashboard', router);

        router.get('/', (req: Request, res: Response) => {
            console.log('DashboardController.getOptions');
            const result = helper.backendService.dashboardManager.getOptions();
            res.json(result);
        });
        
        router.post('/layout', (req: Request, res: Response) => {
            console.log('DashboardController.getServiceOptions');
            helper.backendService.dashboardManager.setLayout(req.body);
            res.sendStatus(201);
        });
        
        router.post('/tiles', (req: Request, res: Response) => {
            console.log('DashboardController.setTile');
            helper.backendService.dashboardManager.setTile(req.body);
            res.sendStatus(201);
        });
        
        router.delete('/tiles/:tileId', (req: Request, res: Response) => {
            console.log('DashboardController.removeTile');
            helper.backendService.dashboardManager.removeTile(req.params.tileId);
            res.sendStatus(201);
        });
    }
}