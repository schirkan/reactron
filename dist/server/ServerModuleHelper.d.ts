import { Router } from 'express';
import { IExternalService } from '../interfaces/IExternalService';
import { IModuleHelper } from '../interfaces/IModuleHelper';
import { BackendService } from '../server/BackendService';
export declare class ServerModuleHelper implements IModuleHelper {
    moduleName: string;
    readonly backendService: BackendService;
    readonly moduleStorage: ElectronStore;
    readonly moduleApiRouter: Router;
    constructor(moduleName: string);
    getService(serviceName: string, moduleName?: string): Promise<IExternalService | undefined>;
    private static serverModuleHelpers;
    static getServerModuleHelpers(moduleName: string): ServerModuleHelper;
}
