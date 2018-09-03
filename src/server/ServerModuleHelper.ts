import { Router } from 'express';
import { IExternalService } from '../interfaces/IExternalService';
import { IModuleHelper } from '../interfaces/IModuleHelper';
import { BackendService } from '../server/BackendService';

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class ServerModuleHelper implements IModuleHelper {
    public readonly backendService: BackendService = BackendService.instance;
    public readonly moduleStorage: ElectronStore;
    public readonly moduleApiRouter: Router;

    constructor(public moduleName: string) {
        this.moduleStorage = new Store({ name: 'module.' + moduleName });
        this.moduleApiRouter = Router();
        this.backendService.expressApp.apiRouter.use('/modules/' + moduleName, this.moduleApiRouter);
    }

    public getService(serviceName: string, moduleName?: string): Promise<IExternalService | undefined> {
        return this.backendService.serviceManager.get(moduleName || this.moduleName, serviceName);
    }

    private static serverModuleHelpers: ServerModuleHelper[] = [];

    public static getServerModuleHelpers(moduleName: string) {
        let helper = ServerModuleHelper.serverModuleHelpers.find(x => x.moduleName === moduleName);
        if (!helper) {
            helper = new ServerModuleHelper(moduleName);
            ServerModuleHelper.serverModuleHelpers.push(helper);
        }
        return helper;
    }
}