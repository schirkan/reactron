import { Request, Response, Router } from 'express';
import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';

export class OptionsController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('OptionsController.start');
        const router = Router();
        helper.moduleApiRouter.use('/options', router);

        router.get('/:moduleName/service/:serviceName', (req: Request, res: Response) => {
            console.log('OptionsController.getServiceOptions');
            const result = helper.backendService.optionsRepository.getServiceOptions(req.params.moduleName, req.params.serviceName);
            res.json(result);
        });
        
        router.post('/:moduleName/service/:serviceName', async (req: Request, res: Response) => {
            console.log('OptionsController.setServiceOptions');
            helper.backendService.optionsRepository.setServiceOptions(req.params.moduleName, req.params.serviceName, req.body);
            helper.backendService.serviceManager.setOptions(req.params.moduleName, req.params.serviceName, req.body);
            res.send();
        });

        router.get('/:moduleName/component/:componentName', (req: Request, res: Response) => {
            console.log('OptionsController.getComponentOptions');
            const result = helper.backendService.optionsRepository.getComponentOptions(req.params.moduleName, req.params.componentName);
            res.json(result);
        });

        router.post('/:moduleName/component/:componentName', async (req: Request, res: Response) => {
            console.log('OptionsController.setComponentOptions');
            helper.backendService.optionsRepository.setComponentOptions(req.params.moduleName, req.params.componentName, req.body);
            res.send();
        });
    }
}