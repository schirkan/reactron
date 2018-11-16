import { ICommandResult, IReactronService } from '@schirkan/reactron-interfaces';
import { routes } from '../../common/apiRoutes';
import { ReactronServiceContext } from '../ReactronServiceContext';
import { registerRoute } from './registerRoute';

export class ModuleController implements IReactronService {
    public async start(context: ReactronServiceContext): Promise<void> {
        console.log('ModuleController.start');

        registerRoute(context.moduleApiRouter, routes.getModules, async (req, res) => {
            console.log('ModuleController.getAll');

            const modules = context.backendService.moduleManager.getAll();
            res.send(modules);
        });

        registerRoute(context.moduleApiRouter, routes.checkUpdates, async (req, res) => {
            console.log('ModuleController.checkUpdates');

            const resultCheckUpdates = await context.backendService.moduleManager.checkUpdates();
            res.send([resultCheckUpdates]);
        });

        registerRoute(context.moduleApiRouter, routes.addModule, async (req, res) => {
            console.log('ModuleController.add');

            const results: ICommandResult[] = [];
            const resultAdd = await context.backendService.moduleManager.add(req.body.repository);
            results.push(resultAdd);

            if (resultAdd.success && resultAdd.data) {
                const moduleRepositoryItem = resultAdd.data;
                const resultInstall = await context.backendService.moduleManager.install(moduleRepositoryItem);
                results.push(resultInstall);

                if (!resultAdd.data.isBuilded) {
                    const resultBuild = await context.backendService.moduleManager.build(moduleRepositoryItem);
                    results.push(resultBuild);
                }
            }
            res.send(results);
        });

        registerRoute(context.moduleApiRouter, routes.deleteModule, async (req, res) => {
            console.log('ModuleController.remove');

            const moduleRepositoryItem = context.backendService.moduleManager.get(req.params.moduleName);
            if (moduleRepositoryItem) {
                const result = await context.backendService.moduleManager.remove(moduleRepositoryItem);
                res.send([result]);
            } else {
                res.sendStatus(404);
            }
        });

        registerRoute(context.moduleApiRouter, routes.rebuildModule, async (req, res) => {
            console.log('ModuleController.rebuild');

            const moduleRepositoryItem = context.backendService.moduleManager.get(req.params.moduleName);
            if (moduleRepositoryItem) {
                const resultInstall = await context.backendService.moduleManager.install(moduleRepositoryItem);
                const resultBuild = await context.backendService.moduleManager.build(moduleRepositoryItem);
                res.send([resultInstall, resultBuild]);
            } else {
                res.sendStatus(404);
            }
        });

        registerRoute(context.moduleApiRouter, routes.updateModule, async (req, res) => {
            console.log('ModuleController.update');

            const moduleRepositoryItem = context.backendService.moduleManager.get(req.params.moduleName);
            if (moduleRepositoryItem) {
                const results: ICommandResult[] = [];
                if (moduleRepositoryItem.hasUpdate) {
                    const resultUpdate = await context.backendService.moduleManager.update(moduleRepositoryItem);
                    results.push(resultUpdate);
                    const resultInstall = await context.backendService.moduleManager.install(moduleRepositoryItem);
                    results.push(resultInstall);
                    const resultBuild = await context.backendService.moduleManager.build(moduleRepositoryItem);
                    results.push(resultBuild);
                }
                res.send(results);
            } else {
                res.sendStatus(404);
            }
        });
    }
}