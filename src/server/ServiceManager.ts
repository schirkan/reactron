import { ICommandResult } from "../interfaces/ICommandResult";
import { IExternalService } from "../interfaces/IExternalService";
import { IServiceRepositoryItem } from "../interfaces/IServiceRepositoryItem";
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
        let serviceRepositoryItem = this.serviceRepository.get(moduleName, serviceName);
        if (!serviceRepositoryItem) {
            const result = await this.loadService(moduleName, serviceName);
            if (result.success) {
                serviceRepositoryItem = this.serviceRepository.get(moduleName, serviceName);
            }
        }
        return serviceRepositoryItem && serviceRepositoryItem.instance;
    }

    public startAllServices(): Promise<ICommandResult> {
        return command('startAllServices', undefined, async (result) => {
            const modules = this.moduleRepository.getAll();
            result.log.push('Modules: ' + JSON.stringify(modules.map(x => x.name)));

            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < modules.length; i++) {
                const m = modules[i];

                result.log.push('Loading: ' + m.serverFile);
                const servicesTypes = require(m.serverFile);
                const exportKeys = Object.keys(servicesTypes);
                result.log.push('Exports: ' + JSON.stringify(exportKeys));

                // tslint:disable-next-line:prefer-for-of
                for (let j = 0; j < exportKeys.length; j++) {
                    const serviceName = exportKeys[j];
                    result.children.push(await this.loadService(m.name, serviceName));
                }
            }
        });
    }

    public stopAllServices(): Promise<ICommandResult> {
        return command('stopAllServices', undefined, async (result) => {
            const services = this.serviceRepository.getAll();

            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < services.length; i++) {
                const serviceRepositoryItem = services[i];
                result.children.push(await this.stopService(serviceRepositoryItem));
            }
        });
    }

    private stopService(serviceRepositoryItem: IServiceRepositoryItem): Promise<ICommandResult> {
        const serviceKey = serviceRepositoryItem.moduleName + '.' + serviceRepositoryItem.name;
        return command('stopService', serviceKey, async (result) => {
            if (serviceRepositoryItem.state === "stopped") {
                return;
            }
            try {
                if (serviceRepositoryItem.instance.start) {
                    await serviceRepositoryItem.instance.stop();
                }
                serviceRepositoryItem.state = "stopped";
            } catch (error) {
                serviceRepositoryItem.state = "error";
                serviceRepositoryItem.log.push(error);
                result.log.push('Error stopping service: ' + serviceKey);
            }
        });
    }

    private startService(serviceRepositoryItem: IServiceRepositoryItem): Promise<ICommandResult> {
        const serviceKey = serviceRepositoryItem.moduleName + '.' + serviceRepositoryItem.name;
        return command('startService', serviceKey, async (result) => {
            if (serviceRepositoryItem.state === "starting" || serviceRepositoryItem.state === "running") {
                return;
            }
            serviceRepositoryItem.state = "starting";
            try {
                if (serviceRepositoryItem.instance.start) {
                    await serviceRepositoryItem.instance.start(this);
                }
                serviceRepositoryItem.state = "running";
            } catch (error) {
                serviceRepositoryItem.state = "error";
                serviceRepositoryItem.log.push(error);
                result.log.push('Error starting service: ' + serviceKey);
            }
        });
    }

    private setOptions(serviceRepositoryItem: IServiceRepositoryItem, options: any): Promise<ICommandResult> {
        return command('setOptions', serviceRepositoryItem.moduleName + '.' + serviceRepositoryItem.name, async () => {
            if (serviceRepositoryItem.instance.setOptions) {
                await serviceRepositoryItem.instance.setOptions(options);
            }
        });
    }

    private loadService(moduleName: string, serviceName: string): Promise<ICommandResult> {
        const serviceKey = moduleName + '.' + serviceName;
        return command('loadService', serviceKey, async (result) => {
            if (this.serviceRepository.get(moduleName, serviceName)) {
                return; // already running
            }

            const moduleDefinition = this.moduleRepository.get(moduleName);
            if (!moduleDefinition) {
                throw new Error('Module not found: ' + moduleName);
            }

            let serviceTypes: any;
            try {
                result.log.push('Loading: ' + moduleDefinition.serverFile);
                serviceTypes = require(moduleDefinition.serverFile)
            } catch (error) {
                throw new Error('Error importing Module: ' + moduleDefinition.serverFile);
            }

            const serviceType = serviceTypes[serviceName];
            if (!serviceType) {
                throw new Error('Service not found: ' + serviceName);
            }
            const serviceInstance = new serviceType() as IExternalService;

            const serviceRepositoryItem: IServiceRepositoryItem = {
                name: serviceName,
                moduleName,
                instance: serviceInstance,
                log: [],
                description: '',
                state: 'stopped',
                options: {} // TODO
            };

            this.serviceRepository.add(serviceRepositoryItem);

            result.children.push(await this.setOptions(serviceRepositoryItem, serviceRepositoryItem.options));
            result.children.push(await this.startService(serviceRepositoryItem));
        });
    }
}