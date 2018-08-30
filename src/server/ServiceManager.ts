import { IExternalService } from "../interfaces/IExternalService";
import { ModuleRepository } from "./ModuleRepository";
import { ServiceRepository } from "./ServiceRepository";

// dependency loader für services
export class ServiceManager {
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