import { Request, Response, Router } from 'express';
import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';

export class ModuleController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('ModuleController.start');
        const router = Router();
        helper.moduleApiRouter.use('/modules', router);

        router.get('/', (req: Request, res: Response) => {
            console.log('ModuleController.getAll');
            const modules = helper.backendService.moduleManager.getAll();
            res.json(modules);
        });
        
        router.post('/:repository', async (req: Request, res: Response) => {
            console.log('ModuleController.add');
            const result = await helper.backendService.moduleManager.add(req.params.repository);
            res.json(result);
        });

        router.get('/:moduleName', (req: Request, res: Response) => {
            console.log('ModuleController.get');
            const module = helper.backendService.moduleManager.get(req.params.moduleName);
            res.json(module);
        });
        
        router.delete('/:moduleName', async (req: Request, res: Response) => {
            console.log('ModuleController.remove');
            const result = await helper.backendService.moduleManager.remove(req.params.moduleName);
            res.json(result);
        });
        
        router.post('/:moduleName/build', async (req: Request, res: Response) => {
            console.log('ModuleController.build');
            const result = await helper.backendService.moduleManager.build(req.params.moduleName);
            res.json(result);
        });
        
        router.post('/:moduleName/install', async (req: Request, res: Response) => {
            console.log('ModuleController.install');
            const result = await helper.backendService.moduleManager.install(req.params.moduleName);
            res.json(result);
        });
        
        router.post('/:moduleName/update', async (req: Request, res: Response) => {
            console.log('ModuleController.update');
            const result = await helper.backendService.moduleManager.update(req.params.moduleName);
            res.json(result);
        });
    }
}