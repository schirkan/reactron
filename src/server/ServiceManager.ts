import { ICommandResult } from "../interfaces/ICommandResult";
import { IExternalService } from "../interfaces/IExternalService";
import { command } from "./commandResultWrapper";
import { ModuleRepository } from "./ModuleRepository";
import { ServiceRepository } from "./ServiceRepository";

// dependency loader für services
export class ServiceManager {
    constructor(
        private serviceRepository: ServiceRepository,
        private moduleRepository: ModuleRepository
    ) { }

    public async get(serviceName: string, moduleName: string): Promise<IExternalService | undefined> {
        let serviceInstance = this.serviceRepository.get(moduleName, serviceName);
        if (!serviceInstance) {
            // load service
            const loadResult = await this.startService(moduleName, serviceName);
            if (loadResult.success) {
                // retry
                serviceInstance = this.serviceRepository.get(moduleName, serviceName);
            }
        }
        return serviceInstance;
    }

    public startAllServices(): Promise<ICommandResult> {
        return command('startAllServices', undefined, async () => {
            const modules = this.moduleRepository.getAll();
            const childResults: ICommandResult[] = [];

            for (const m of modules) {
                const servicesTypes = await import(m.serverFile);
                for (const serviceName of servicesTypes) {
                    const loadResult = await this.startService(m.name, serviceName);
                    childResults.push(loadResult);
                }
            }
        });
    }

    public stopAllServices(): Promise<ICommandResult> {
        return command('stopAllServices', undefined, async () => {
            const services = this.serviceRepository.getAll();
            const childResults: ICommandResult[] = [];

            for (const key in services) {
                if (services.hasOwnProperty(key)) {
                    const serviceInstance = services[key];
                    const loadResult = await this.stopService(serviceInstance, key);
                    childResults.push(loadResult);
                }
            }
        });
    }

    private stopService(serviceInstance: IExternalService, serviceKey: string): Promise<ICommandResult>{        
        return command('stopService', serviceKey, async () => {
            await serviceInstance.stop();
        });
    }

    private startService(moduleName: string, serviceName: string): Promise<ICommandResult> {
        return command('loadService', arguments, async () => {
            if (this.serviceRepository.get(moduleName, serviceName)) {
                return; // already running
            }

            const moduleDefinition = this.moduleRepository.get(moduleName);
            if (!moduleDefinition) {
                throw new Error('Module not found: ' + moduleName);
            }
            const serviceTypes = await import(moduleDefinition.serverFile)
            const serviceType = serviceTypes[serviceName];
            if (!serviceType) {
                throw new Error('Service not found: ' + serviceName);
            }

            const serviceInstance = new serviceType() as IExternalService;

            // start service
            await serviceInstance.start(this);

            this.serviceRepository.add(moduleName, serviceName, serviceInstance);
        });
    }
}