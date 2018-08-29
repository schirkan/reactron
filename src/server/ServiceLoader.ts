import { IExternalService } from "../interfaces/IExternalService";
import { IServiceLoader } from "../interfaces/IServiceLoader";
import { ModuleRepository } from "./ModuleRepository";

// dependency loader für services
export class ServiceLoader implements IServiceLoader {
    private services: { [key: string]: IExternalService; } = {};

    constructor(private moduleRepository: ModuleRepository){}

    public getService(serviceName: string, moduleName: string): IExternalService {
        return this.services[moduleName + '.' + serviceName];
        // TODO
    }
    public getServices(): { [key: string]: IExternalService; } {
        return this.services;
        // TODO
    }
}