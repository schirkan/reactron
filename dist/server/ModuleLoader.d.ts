import { IBackendServiceConfig } from '../interfaces/IBackendServiceConfig';
import { IModuleRepositoryItem } from "../interfaces/IModuleRepositoryItem";
export declare class ModuleLoader {
    private config;
    private modulesPath;
    constructor(config: IBackendServiceConfig);
    loadAllModules(): Promise<IModuleRepositoryItem[]>;
    loadModule(folderName: string): Promise<IModuleRepositoryItem | undefined>;
}
