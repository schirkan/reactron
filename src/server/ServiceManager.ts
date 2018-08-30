import { IExternalService } from "../interfaces/IExternalService";
import { IServiceManager } from "../interfaces/IServiceManager";
import { ModuleRepository } from "./ModuleRepository";
import { ServiceRepository } from "./ServiceRepository";

// dependency loader für services
export class ServiceManager implements IServiceManager {
    constructor(
        private serviceRepository: ServiceRepository,
        private moduleRepository: ModuleRepository
    ) { }

    public get(serviceName: string, moduleName: string): IExternalService | undefined {
        return this.serviceRepository.get(moduleName, serviceName);
    }
    public getAll(): { [key: string]: IExternalService; } {
        return this.serviceRepository.getAll();
    }
    // TODO: load
}