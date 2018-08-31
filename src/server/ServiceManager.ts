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

    public async get(moduleName: string, serviceName: string): Promise<IExternalService | undefined> {
        console.log('ServiceManager.get: ' + moduleName + '.' + serviceName);
        let serviceInstance = this.serviceRepository.get(moduleName, serviceName);
        if (!serviceInstance) {
            // load service
            const result = await this.startService(moduleName, serviceName);
            if (result.success) {
                // retry
                serviceInstance = this.serviceRepository.get(moduleName, serviceName);
            }
        }
        return serviceInstance;
    }

    public async startAllServices(): Promise<ICommandResult> {
        return await command('startAllServices', undefined, async () => {
            const modules = this.moduleRepository.getAll();
            const childResults: ICommandResult[] = [];

            console.log('Modules: ' + JSON.stringify(modules.map(x => x.name)));

            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < modules.length; i++) {
                const m = modules[i];

                console.log('Loading: ' + m.serverFile);
                const servicesTypes = require(m.serverFile);
                const exportKeys = Object.keys(servicesTypes);
                console.log('Exports: ' + JSON.stringify(exportKeys));

                // tslint:disable-next-line:prefer-for-of
                for (let j = 0; j < exportKeys.length; j++) {
                    const serviceName = exportKeys[j];
                    const result = await this.startService(m.name, serviceName);
                    childResults.push(result);
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

    private stopService(serviceInstance: IExternalService, serviceKey: string): Promise<ICommandResult> {
        return command('stopService', serviceKey, async () => {
            await serviceInstance.stop();
        });
    }

    private startService(moduleName: string, serviceName: string): Promise<ICommandResult> {
        return command('startService', arguments, async () => {
            if (this.serviceRepository.get(moduleName, serviceName)) {
                return; // already running
            }

            const moduleDefinition = this.moduleRepository.get(moduleName);
            if (!moduleDefinition) {
                throw new Error('Module not found: ' + moduleName);
            }

            let serviceTypes: any;
            try {
                console.log('Loading: ' + moduleDefinition.serverFile);
                serviceTypes = require(moduleDefinition.serverFile)
            } catch (error) {
                throw new Error('Error importing Module: ' + moduleDefinition.serverFile);
            }

            const serviceType = serviceTypes[serviceName];
            if (!serviceType) {
                throw new Error('Service not found: ' + serviceName);
            }

            const serviceInstance = new serviceType() as IExternalService;

            // start service
            await serviceInstance.start(this);

            console.log('Service started: ' + moduleName + '.' + serviceName, serviceInstance);
            this.serviceRepository.add(moduleName, serviceName, serviceInstance);
        });
    }
}