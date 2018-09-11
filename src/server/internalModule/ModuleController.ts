import { routes } from '../../common/apiRoutes';
import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';
import { registerRoute } from './registerRoute';

export class ModuleController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('ModuleController.start');

        registerRoute(helper.moduleApiRouter, routes.getModules, async (req, res) => {
            console.log('ModuleController.getAll');
            const modules = helper.backendService.moduleManager.getAll();
            res.send(modules);
        });

        registerRoute(helper.moduleApiRouter, routes.addModule, async (req, res) => {
            console.log('ModuleController.add');
            const result = await helper.backendService.moduleManager.add(req.params.repository);
            res.send(result);
        });

        registerRoute(helper.moduleApiRouter, routes.getModule, async (req, res) => {
            console.log('ModuleController.get');
            const module = helper.backendService.moduleManager.get(req.params.moduleName);
            res.send(module);
        });
        
        registerRoute(helper.moduleApiRouter, routes.deleteModule, async (req, res) => {
            console.log('ModuleController.remove');
            const result = await helper.backendService.moduleManager.remove(req.params.moduleName);
            res.send(result);
        });
        
        registerRoute(helper.moduleApiRouter, routes.buildModule, async (req, res) => {
            console.log('ModuleController.build');
            const result = await helper.backendService.moduleManager.build(req.params.moduleName);
            res.send(result);
        });
        
        registerRoute(helper.moduleApiRouter, routes.installModule, async (req, res) => {
            console.log('ModuleController.install');
            const result = await helper.backendService.moduleManager.install(req.params.moduleName);
            res.send(result);
        });
        
        registerRoute(helper.moduleApiRouter, routes.updateModule, async (req, res) => {
            console.log('ModuleController.update');
            const result = await helper.backendService.moduleManager.update(req.params.moduleName);
            res.send(result);
        });
    }
}