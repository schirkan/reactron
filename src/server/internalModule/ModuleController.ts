import { ICommandResult, IReactronServiceContext } from '@schirkan/reactron-interfaces';
import { routes } from '../../common/apiRoutes';
import { ReactronServiceContext } from '../ReactronServiceContext';
import { IModuleController } from '../../common/serviceInterfaces';

export class ModuleController implements IModuleController {
  private context: ReactronServiceContext
  
  constructor(context: IReactronServiceContext) {
    this.context = context as any;
   }

  public async getModules() {
    return this.context.backendService.moduleManager.getAll();
  }

  public async addModule(repository: string) {
    const results: ICommandResult[] = [];
    const resultAdd = await this.context.backendService.moduleManager.add(repository);
    results.push(resultAdd);

    if (resultAdd.success && resultAdd.data) {
      const moduleRepositoryItem = resultAdd.data;

      if (moduleRepositoryItem.isBuilded) {
        const resultInstall = await this.context.backendService.moduleManager.install(moduleRepositoryItem, true);
        results.push(resultInstall);
      } else {
        const resultInstall = await this.context.backendService.moduleManager.install(moduleRepositoryItem, false);
        results.push(resultInstall);
        const resultBuild = await this.context.backendService.moduleManager.build(moduleRepositoryItem);
        results.push(resultBuild);
      }
    }
    return results;
  }

  public async deleteModule(moduleName: string): Promise<ICommandResult[]> {
    const moduleRepositoryItem = this.context.backendService.moduleManager.get(moduleName);
    if (moduleRepositoryItem) {
      const result = await this.context.backendService.moduleManager.remove(moduleRepositoryItem);
      return [result];
    } else {
      throw new Error('not found');
    }
  }

  public async rebuildModule(moduleName: string): Promise<ICommandResult[]> {
    const moduleRepositoryItem = this.context.backendService.moduleManager.get(moduleName);
    if (moduleRepositoryItem) {
      const resultInstall = await this.context.backendService.moduleManager.install(moduleRepositoryItem, false);
      const resultBuild = await this.context.backendService.moduleManager.build(moduleRepositoryItem);
      return [resultInstall, resultBuild];
    } else {
      throw new Error('not found');
    }
  }

  public async updateModule(moduleName: string): Promise<ICommandResult[]> {
    const moduleRepositoryItem = this.context.backendService.moduleManager.get(moduleName);
    if (moduleRepositoryItem) {
      const results: ICommandResult[] = [];
      if (moduleRepositoryItem.hasUpdate) {
        const resultUpdate = await this.context.backendService.moduleManager.update(moduleRepositoryItem);
        results.push(resultUpdate);

        if (moduleRepositoryItem.isBuilded) {
          const resultInstall = await this.context.backendService.moduleManager.install(moduleRepositoryItem, true);
          results.push(resultInstall);
        } else {
          const resultInstall = await this.context.backendService.moduleManager.install(moduleRepositoryItem, false);
          results.push(resultInstall);
          const resultBuild = await this.context.backendService.moduleManager.build(moduleRepositoryItem);
          results.push(resultBuild);
        }
      }
      return results;
    } else {
      throw new Error('not found');
    }
  }

  public async checkUpdates(): Promise<ICommandResult[]> {
    const resultCheckUpdates = await this.context.backendService.moduleManager.checkUpdates();
    return [resultCheckUpdates];
  }

  // -----------------

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
      const moduleRepositoryItem = context.backendService.moduleManager.get(req.body.moduleName);
      if (moduleRepositoryItem) {
        const result = await context.backendService.moduleManager.remove(moduleRepositoryItem);
        res.send([result]);
      } else {
        res.sendStatus(404);
      }
    });

    context.registerRoute(routes.rebuildModule, async (req, res) => {
      const moduleRepositoryItem = context.backendService.moduleManager.get(req.body.moduleName);
      if (moduleRepositoryItem) {
        const resultInstall = await context.backendService.moduleManager.install(moduleRepositoryItem, false);
        const resultBuild = await context.backendService.moduleManager.build(moduleRepositoryItem);
        res.send([resultInstall, resultBuild]);
      } else {
        res.sendStatus(404);
      }
    });

    context.registerRoute(routes.updateModule, async (req, res) => {
      const moduleRepositoryItem = context.backendService.moduleManager.get(req.body.moduleName);
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