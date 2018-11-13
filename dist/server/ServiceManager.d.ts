import { ICommandResult } from "../interfaces/ICommandResult";
import { IExternalService } from "../interfaces/IExternalService";
import { ModuleRepository } from "./ModuleRepository";
import { ServiceOptionsRepository } from "./ServiceOptionsRepository";
import { ServiceRepository } from "./ServiceRepository";
export declare class ServiceManager {
    private serviceRepository;
    private moduleRepository;
    private optionsRepository;
    constructor(serviceRepository: ServiceRepository, moduleRepository: ModuleRepository, optionsRepository: ServiceOptionsRepository);
    get(moduleName: string, serviceName: string): Promise<IExternalService | undefined>;
    setOptions(moduleName: string, serviceName: string, options: any): Promise<void>;
    startAllServices(): Promise<ICommandResult>;
    stopAllServices(): Promise<ICommandResult>;
    private stopService;
    private startService;
    private setOptionsInternal;
    private loadService;
    private getDefaultObjectOptions;
    private getDefaultFieldOptions;
}
