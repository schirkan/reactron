import { ICommandResult, IReactronService } from '@schirkan/reactron-interfaces';
import { routes } from '../../common/apiRoutes';
import { ReactronServiceContext } from '../ReactronServiceContext';

export class ModuleController implements IReactronService {
  public async start(context: ReactronServiceContext): Promise<void> {
    context.registerRoute(routes.getModules, async (req, res) => {
      const modules = context.backendService.moduleManager.getAll();
      res.send(modules);
    });

    context.registerRoute(routes.checkUpdates, async (req, res) => {
      const resultCheckUpdates = await context.backendService.moduleManager.checkUpdates();
      res.send([resultCheckUpdates]);
    });

    context.registerRoute(routes.addModule, async (req, res) => {
      const results: ICommandResult[] = [];
      const resultAdd = await context.backendService.moduleManager.add(req.body.repository);
      results.push(resultAdd);

      if (resultAdd.success && resultAdd.data) {
        const moduleRepositoryItem = resultAdd.data;

        if (moduleRepositoryItem.isBuilded) {
          const resultInstall = await context.backendService.moduleManager.install(moduleRepositoryItem, true);
          results.push(resultInstall);
        } else {
          const resultInstall = await context.backendService.moduleManager.install(moduleRepositoryItem, false);
          results.push(resultInstall);
          const resultBuild = await context.backendService.moduleManager.build(moduleRepositoryItem);
          results.push(resultBuild);
        }
      }
      res.send(results);
    });

    context.registerRoute(routes.deleteModule, async (req, res) => {
      const moduleRepositoryItem = context.backendService.moduleManager.get(req.params.moduleName);
      if (moduleRepositoryItem) {
        const result = await context.backendService.moduleManager.remove(moduleRepositoryItem);
        res.send([result]);
      } else {
        res.sendStatus(404);
      }
    });

    context.registerRoute(routes.rebuildModule, async (req, res) => {
      const moduleRepositoryItem = context.backendService.moduleManager.get(req.params.moduleName);
      if (moduleRepositoryItem) {
        const resultInstall = await context.backendService.moduleManager.install(moduleRepositoryItem, false);
        const resultBuild = await context.backendService.moduleManager.build(moduleRepositoryItem);
        res.send([resultInstall, resultBuild]);
      } else {
        res.sendStatus(404);
      }
    });

    context.registerRoute(routes.updateModule, async (req, res) => {
      const moduleRepositoryItem = context.backendService.moduleManager.get(req.params.moduleName);
      if (moduleRepositoryItem) {
        const results: ICommandResult[] = [];
        if (moduleRepositoryItem.hasUpdate) {
          const resultUpdate = await context.backendService.moduleManager.update(moduleRepositoryItem);
          results.push(resultUpdate);

          if (moduleRepositoryItem.isBuilded) {
            const resultInstall = await context.backendService.moduleManager.install(moduleRepositoryItem, true);
            results.push(resultInstall);
          } else {
            const resultInstall = await context.backendService.moduleManager.install(moduleRepositoryItem, false);
            results.push(resultInstall);
            const resultBuild = await context.backendService.moduleManager.build(moduleRepositoryItem);
            results.push(resultBuild);
          }
        }
        res.send(results);
      } else {
        res.sendStatus(404);
      }
    });
  }
}