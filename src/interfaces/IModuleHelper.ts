import { BackendService } from '../server/BackendService';
import { IExternalService } from './IExternalService';

export interface IModuleHelper {
    readonly backendService: BackendService;
    readonly moduleStorage: ElectronStore;
    readonly moduleName: string;

    getService(serviceName: string, moduleName?: string): Promise<IExternalService | undefined>;
}