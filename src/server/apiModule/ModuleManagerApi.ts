import { Request, Response, Router } from 'express';
import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';

export class ModuleManagerApi implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('moduleManagerApi.start');
        const router = Router();
        helper.moduleApiRouter.use('/moduleManager', router);

        router.get('/modules', (req: Request, res: Response) => {
            console.log('moduleManagerApi.get');
            const modules = helper.backendService.moduleManager.getAll();
            res.json(modules);
        });
        
        router.get('/add/:repository', async (req: Request, res: Response) => {
            console.log('moduleManagerApi.add');
            const result = await helper.backendService.moduleManager.add(req.params.repository);
            res.json(result);
        });
        
        router.get('/remove/:moduleName', async (req: Request, res: Response) => {
            console.log('moduleManagerApi.remove');
            const result = await helper.backendService.moduleManager.remove(req.params.moduleName);
            res.json(result);
        });
        
        router.get('/build/:moduleName', async (req: Request, res: Response) => {
            console.log('moduleManagerApi.build');
            const result = await helper.backendService.moduleManager.build(req.params.moduleName);
            res.json(result);
        });
        
        router.get('/install/:moduleName', async (req: Request, res: Response) => {
            console.log('moduleManagerApi.install');
            const result = await helper.backendService.moduleManager.install(req.params.moduleName);
            res.json(result);
        });
        
        router.get('/update/:moduleName', async (req: Request, res: Response) => {
            console.log('moduleManagerApi.update');
            const result = await helper.backendService.moduleManager.update(req.params.moduleName);
            res.json(result);
        });
    }
}