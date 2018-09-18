import { routes } from '../../common/apiRoutes';
import { ICommandResult } from '../../interfaces/ICommandResult';
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

        registerRoute(helper.moduleApiRouter, routes.checkUpdates, async (req, res) => {
            console.log('ModuleController.checkUpdates');

            const resultCheckUpdates = await helper.backendService.moduleManager.checkUpdates();
            res.send([resultCheckUpdates]);
        });

        registerRoute(helper.moduleApiRouter, routes.addModule, async (req, res) => {
            console.log('ModuleController.add');

            const results: ICommandResult[] = [];
            const resultAdd = await helper.backendService.moduleManager.add(req.body.repository);
            results.push(resultAdd);

            if (resultAdd.success && resultAdd.data) {
                const moduleRepositoryItem = resultAdd.data;
                const resultInstall = await helper.backendService.moduleManager.install(moduleRepositoryItem);
                results.push(resultInstall);

                if (!resultAdd.data.isBuilded) {
                    const resultBuild = await helper.backendService.moduleManager.build(moduleRepositoryItem);
                    results.push(resultBuild);
                }
            }
            res.send(results);
        });

        registerRoute(helper.moduleApiRouter, routes.deleteModule, async (req, res) => {
            console.log('ModuleController.remove');

            const moduleRepositoryItem = helper.backendService.moduleManager.get(req.params.moduleName);
            if (moduleRepositoryItem) {
                const result = await helper.backendService.moduleManager.remove(moduleRepositoryItem);
                res.send([result]);
            } else {
                res.sendStatus(404);
            }
        });

        registerRoute(helper.moduleApiRouter, routes.rebuildModule, async (req, res) => {
            console.log('ModuleController.rebuild');

            const moduleRepositoryItem = helper.backendService.moduleManager.get(req.params.moduleName);
            if (moduleRepositoryItem) {
                const resultInstall = await helper.backendService.moduleManager.install(moduleRepositoryItem);
                const resultBuild = await helper.backendService.moduleManager.build(moduleRepositoryItem);
                res.send([resultInstall, resultBuild]);
            } else {
                res.sendStatus(404);
            }
        });

        registerRoute(helper.moduleApiRouter, routes.updateModule, async (req, res) => {
            console.log('ModuleController.update');

            const moduleRepositoryItem = helper.backendService.moduleManager.get(req.params.moduleName);
            if (moduleRepositoryItem) {
                const results: ICommandResult[] = [];
                if (moduleRepositoryItem.hasUpdate) {
                    const resultUpdate = await helper.backendService.moduleManager.update(moduleRepositoryItem);
                    results.push(resultUpdate);
                    const resultInstall = await helper.backendService.moduleManager.install(moduleRepositoryItem);
                    results.push(resultInstall);
                    const resultBuild = await helper.backendService.moduleManager.build(moduleRepositoryItem);
                    results.push(resultBuild);
                }
                res.send(results);
            } else {
                res.sendStatus(404);
            }
        });
    }
}