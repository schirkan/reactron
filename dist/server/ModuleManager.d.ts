import { IBackendServiceConfig } from "../interfaces/IBackendServiceConfig";
import { ICommandResult, ICommandResultWithData } from "../interfaces/ICommandResult";
import { IModuleRepositoryItem } from "../interfaces/IModuleRepositoryItem";
import { ModuleLoader } from "./ModuleLoader";
import { ModuleRepository } from "./ModuleRepository";
export declare class ModuleManager {
    private config;
    private moduleRepository;
    private moduleLoader;
    private modulesRootPath;
    constructor(config: IBackendServiceConfig, moduleRepository: ModuleRepository, moduleLoader: ModuleLoader);
    loadAllModules(): Promise<void>;
    getAll(): IModuleRepositoryItem[];
    get(moduleName: string): IModuleRepositoryItem | undefined;
    add(repository: string): Promise<ICommandResultWithData<IModuleRepositoryItem | undefined>>;
    update(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult>;
    install(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult>;
    build(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult>;
    remove(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult>;
    checkUpdates(): Promise<ICommandResultWithData<string[]>>;
    hasUpdate(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResultWithData<boolean>>;
    private isDirEmpty;
}
