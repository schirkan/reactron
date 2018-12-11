import { IReactronServiceContext, ISystemSettings } from '@schirkan/reactron-interfaces';
import { Router } from 'express';
import { BackendService } from './BackendService';

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class ReactronServiceContext implements IReactronServiceContext {
    public readonly backendService: BackendService = BackendService.instance;
    public readonly moduleStorage: ElectronStore;
    public readonly moduleApiRouter: Router;

    constructor(public moduleName: string) {
        this.moduleStorage = new Store({ name: 'module.' + moduleName });
        this.moduleApiRouter = Router();

        const escapedModuleName = moduleName.replace('/', '@');
        const moduleApiPath = '/modules/' + escapedModuleName;
        console.log('Module Api Path: ' + moduleApiPath);

        this.backendService.expressApp.apiRouter.use(moduleApiPath, this.moduleApiRouter);
    }

    public getSettings():Readonly<ISystemSettings>{
        return this.backendService.settings.get();
    }

    public getService<TService = any>(serviceName: string, moduleName?: string): TService | undefined {
        return this.backendService.serviceManager.get(moduleName || this.moduleName, serviceName) as TService | undefined;
    }

    public async getServiceAsync<TService = any>(serviceName: string, moduleName?: string): Promise<TService | undefined> {
        return await this.backendService.serviceManager.getAsync(moduleName || this.moduleName, serviceName) as TService | undefined;
    }

    private static serviceContexts: ReactronServiceContext[] = [];

    public static getServiceContext(moduleName: string) {
        let context = ReactronServiceContext.serviceContexts.find(x => x.moduleName === moduleName);
        if (!context) {
            context = new ReactronServiceContext(moduleName);
            ReactronServiceContext.serviceContexts.push(context);
        }
        return context;
    }
}