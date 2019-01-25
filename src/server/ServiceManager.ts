import { ICommandResult, IFieldDefinition, IReactronService, IReactronServiceDefinition, IServiceManager, IServiceRepositoryItem, IReactronServiceContext } from '@schirkan/reactron-interfaces';
import { command } from './commandResultWrapper';
import { ModuleRepository } from './ModuleRepository';
import { ReactronServiceContext } from './ReactronServiceContext';
import { ServiceOptionsRepository } from './ServiceOptionsRepository';
import { ServiceRepository } from './ServiceRepository';

// http://2ality.com/2017/11/proxy-method-calls.html
function traceMethodCalls(obj: any, context: IReactronServiceContext) {
  const proxy = new Proxy(obj, {
    get(target, propKey, receiver) {
      const targetValue = Reflect.get(target, propKey, receiver);
      if (typeof targetValue === 'function') {
        return (...args: any[]) => {
          context.log.debug('CALL ' + propKey.toString(), args.length ? args : undefined);
          try {
            // return targetValue.apply(proxy, args);
            return targetValue.apply(target, args);
          } catch (error) {
            context.log.debug('ERROR ' + (error && error.message || error), error);
            throw error;
          }
        }
      } else {
        return targetValue;
      }
    }
  })
  return proxy;
}

// dependency loader für services
export class ServiceManager implements IServiceManager {
  constructor(
    private serviceRepository: ServiceRepository,
    private moduleRepository: ModuleRepository,
    private optionsRepository: ServiceOptionsRepository
  ) { }

  public async getAsync(moduleName: string, serviceName: string): Promise<IReactronService | undefined> {
    let serviceRepositoryItem = this.serviceRepository.get(moduleName, serviceName);
    if (!serviceRepositoryItem) {
      const result = await this.loadService(moduleName, serviceName);
      if (result.success) {
        serviceRepositoryItem = this.serviceRepository.get(moduleName, serviceName);
      }
    }
    return serviceRepositoryItem && serviceRepositoryItem.instance;
  }

  public get(moduleName: string, serviceName: string): IReactronService | undefined {
    const serviceRepositoryItem = this.serviceRepository.get(moduleName, serviceName);
    return serviceRepositoryItem && serviceRepositoryItem.instance;
  }

  public getOptions(moduleName: string, serviceName: string): any {
    return this.optionsRepository.get(moduleName, serviceName);
  }

  public async setOptions(moduleName: string, serviceName: string, options: any): Promise<void> {
    this.optionsRepository.set(moduleName, serviceName, options);

    const serviceRepositoryItem = this.serviceRepository.get(moduleName, serviceName);
    if (serviceRepositoryItem) {
      await this.setOptionsInternal(serviceRepositoryItem, options);
    }
  }

  public startAllServices(): Promise<ICommandResult> {
    return command('startAllServices', undefined, async (result) => {
      const modules = this.moduleRepository.getAll();
      result.log.push('Modules: ' + JSON.stringify(modules.map(x => x.name)));

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < modules.length; i++) {
        const m = modules[i];

        if (m.serverFile) {
          result.log.push('Loading: ' + m.serverFile);
          try {
            const serverFileExport = require(m.serverFile) as any;
            const serviceDefinitions = serverFileExport.services as IReactronServiceDefinition[];
            // TODO: ex handling
            if (serviceDefinitions && serviceDefinitions.length) {
              // tslint:disable-next-line:prefer-for-of
              for (let j = 0; j < serviceDefinitions.length; j++) {
                const serviceName = serviceDefinitions[j].name;
                result.children.push(await this.loadService(m.name, serviceName));
              }
            }
          } catch (error) {
            console.log(error);
          }
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
      if (serviceRepositoryItem.state === 'stopped') {
        return;
      }
      serviceRepositoryItem.context.log.debug('State: stopping');
      try {
        if (serviceRepositoryItem.instance.stop) {
          await serviceRepositoryItem.instance.stop();
        }
        serviceRepositoryItem.state = 'stopped';
        serviceRepositoryItem.context.log.debug('State: stopped');
      } catch (error) {
        serviceRepositoryItem.state = 'error';
        serviceRepositoryItem.context.log.error('State: error stopping service', error);
        result.success = false;
        result.log.push('Error stopping service: ' + serviceKey);
      }
    });
  }

  private startService(serviceRepositoryItem: IServiceRepositoryItem): Promise<ICommandResult> {
    const serviceKey = serviceRepositoryItem.moduleName + '.' + serviceRepositoryItem.name;
    return command('startService', serviceKey, async (result) => {
      if (serviceRepositoryItem.state === 'starting' || serviceRepositoryItem.state === 'running') {
        return;
      }
      serviceRepositoryItem.state = 'starting';
      serviceRepositoryItem.context.log.debug('State: starting');
      try {
        if (serviceRepositoryItem.instance.start) {
          await serviceRepositoryItem.instance.start(serviceRepositoryItem.context);
        }
        serviceRepositoryItem.state = 'running';
        serviceRepositoryItem.context.log.debug('State: running');
      } catch (error) {
        serviceRepositoryItem.state = 'error';
        serviceRepositoryItem.context.log.error('State: error starting service', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        result.log.push('Error starting service: ' + serviceKey);
      }
    });
  }

  private setOptionsInternal(serviceRepositoryItem: IServiceRepositoryItem, options: any): Promise<ICommandResult> {
    return command('setOptions', serviceRepositoryItem.moduleName + '.' + serviceRepositoryItem.name, async () => {
      if (serviceRepositoryItem.instance.setOptions) {
        serviceRepositoryItem.context.log.debug('setOptions');
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

      if (!moduleDefinition.serverFile) {
        throw new Error('Module has no server file: ' + moduleName);
      }

      let services: IReactronServiceDefinition[];
      try {
        result.log.push('Loading: ' + moduleDefinition.serverFile);
        const serverFileExport = require(moduleDefinition.serverFile) as any;
        services = serverFileExport && serverFileExport.services;
      } catch (error) {
        throw new Error('Error loading Module: ' + moduleDefinition.serverFile);
      }

      if (!services || !Array.isArray(services)) {
        throw new Error('No services found for module: ' + moduleName);
      }

      const serviceDefinition = services.find(x => x.name === serviceName);
      if (!serviceDefinition) {
        throw new Error('Service not found: ' + serviceName);
      }

      const serviceContext = ReactronServiceContext.getServiceContext(moduleName, serviceName);
      const serviceInstance = new serviceDefinition.service(serviceContext);

      // get / init service options
      let serviceOptions = this.optionsRepository.get(moduleName, serviceName);
      if (!serviceOptions) {
        serviceOptions = this.getDefaultObjectOptions(serviceDefinition.fields);
        this.optionsRepository.set(moduleName, serviceName, serviceOptions);
        console.log('Initializing Service Options for ' + serviceKey, serviceOptions);
      }

      const serviceRepositoryItem: IServiceRepositoryItem = {
        ...serviceDefinition,
        moduleName,
        instance: traceMethodCalls(serviceInstance, serviceContext), // TODO serviceInstance, //
        context: serviceContext,
        state: 'stopped',
      };

      this.serviceRepository.add(serviceRepositoryItem);

      result.children.push(await this.setOptionsInternal(serviceRepositoryItem, serviceOptions));
      result.children.push(await this.startService(serviceRepositoryItem));
    });
  }

  private getDefaultObjectOptions(fields?: IFieldDefinition[]): any {
    const result = {};
    if (fields) {
      fields.forEach(field => {
        result[field.name] = this.getDefaultFieldOptions(field);
      });
    }
    return result;
  }

  private getDefaultFieldOptions(fieldDefinition: IFieldDefinition): any {
    let result: any = fieldDefinition.defaultValue;
    if (fieldDefinition.isArray) {
      result = result || [];
    } else if (fieldDefinition.valueType === 'object') {
      result = result || this.getDefaultObjectOptions(fieldDefinition.fields);
    }
    return result;
  }
}