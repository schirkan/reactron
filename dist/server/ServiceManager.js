"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commandResultWrapper_1 = require("./commandResultWrapper");
const ReactronServiceContext_1 = require("./ReactronServiceContext");
// http://2ality.com/2017/11/proxy-method-calls.html
function traceMethodCalls(obj, context) {
    const proxy = new Proxy(obj, {
        get(target, propKey, receiver) {
            const targetValue = Reflect.get(target, propKey, receiver);
            if (typeof targetValue === 'function') {
                return (...args) => {
                    context.log.debug('CALL ' + propKey.toString(), args);
                    try {
                        return targetValue.apply(proxy, args);
                    }
                    catch (error) {
                        context.log.debug('ERROR ' + (error && error.message || error));
                        throw error;
                    }
                };
            }
            else {
                return targetValue;
            }
        }
    });
    return proxy;
}
// dependency loader für services
class ServiceManager {
    constructor(serviceRepository, moduleRepository, optionsRepository) {
        this.serviceRepository = serviceRepository;
        this.moduleRepository = moduleRepository;
        this.optionsRepository = optionsRepository;
    }
    getAsync(moduleName, serviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            let serviceRepositoryItem = this.serviceRepository.get(moduleName, serviceName);
            if (!serviceRepositoryItem) {
                const result = yield this.loadService(moduleName, serviceName);
                if (result.success) {
                    serviceRepositoryItem = this.serviceRepository.get(moduleName, serviceName);
                }
            }
            return serviceRepositoryItem && serviceRepositoryItem.instance;
        });
    }
    get(moduleName, serviceName) {
        const serviceRepositoryItem = this.serviceRepository.get(moduleName, serviceName);
        return serviceRepositoryItem && serviceRepositoryItem.instance;
    }
    getOptions(moduleName, serviceName) {
        return this.optionsRepository.get(moduleName, serviceName);
    }
    setOptions(moduleName, serviceName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.optionsRepository.set(moduleName, serviceName, options);
            const serviceRepositoryItem = this.serviceRepository.get(moduleName, serviceName);
            if (serviceRepositoryItem) {
                yield this.setOptionsInternal(serviceRepositoryItem, options);
            }
        });
    }
    startAllServices() {
        return commandResultWrapper_1.command('startAllServices', undefined, (result) => __awaiter(this, void 0, void 0, function* () {
            const modules = this.moduleRepository.getAll();
            result.log.push('Modules: ' + JSON.stringify(modules.map(x => x.name)));
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < modules.length; i++) {
                const m = modules[i];
                if (m.serverFile) {
                    result.log.push('Loading: ' + m.serverFile);
                    try {
                        const serverFileExport = require(m.serverFile);
                        const serviceDefinitions = serverFileExport.services;
                        // TODO: ex handling
                        if (serviceDefinitions && serviceDefinitions.length) {
                            // tslint:disable-next-line:prefer-for-of
                            for (let j = 0; j < serviceDefinitions.length; j++) {
                                const serviceName = serviceDefinitions[j].name;
                                result.children.push(yield this.loadService(m.name, serviceName));
                            }
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
        }));
    }
    stopAllServices() {
        return commandResultWrapper_1.command('stopAllServices', undefined, (result) => __awaiter(this, void 0, void 0, function* () {
            const services = this.serviceRepository.getAll();
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < services.length; i++) {
                const serviceRepositoryItem = services[i];
                result.children.push(yield this.stopService(serviceRepositoryItem));
            }
        }));
    }
    stopService(serviceRepositoryItem) {
        const serviceKey = serviceRepositoryItem.moduleName + '.' + serviceRepositoryItem.name;
        return commandResultWrapper_1.command('stopService', serviceKey, (result) => __awaiter(this, void 0, void 0, function* () {
            if (serviceRepositoryItem.state === 'stopped') {
                return;
            }
            serviceRepositoryItem.context.log.debug('State: stopping');
            try {
                if (serviceRepositoryItem.instance.stop) {
                    yield serviceRepositoryItem.instance.stop();
                }
                serviceRepositoryItem.state = 'stopped';
                serviceRepositoryItem.context.log.debug('State: stopped');
            }
            catch (error) {
                serviceRepositoryItem.state = 'error';
                serviceRepositoryItem.context.log.error('State: error stopping service', error);
                result.success = false;
                result.log.push('Error stopping service: ' + serviceKey);
            }
        }));
    }
    startService(serviceRepositoryItem) {
        const serviceKey = serviceRepositoryItem.moduleName + '.' + serviceRepositoryItem.name;
        return commandResultWrapper_1.command('startService', serviceKey, (result) => __awaiter(this, void 0, void 0, function* () {
            if (serviceRepositoryItem.state === 'starting' || serviceRepositoryItem.state === 'running') {
                return;
            }
            serviceRepositoryItem.state = 'starting';
            serviceRepositoryItem.context.log.debug('State: starting');
            try {
                if (serviceRepositoryItem.instance.start) {
                    yield serviceRepositoryItem.instance.start(serviceRepositoryItem.context);
                }
                serviceRepositoryItem.state = 'running';
                serviceRepositoryItem.context.log.debug('State: running');
            }
            catch (error) {
                serviceRepositoryItem.state = 'error';
                serviceRepositoryItem.context.log.error('State: error starting service', JSON.stringify(error, Object.getOwnPropertyNames(error)));
                result.log.push('Error starting service: ' + serviceKey);
            }
        }));
    }
    setOptionsInternal(serviceRepositoryItem, options) {
        return commandResultWrapper_1.command('setOptions', serviceRepositoryItem.moduleName + '.' + serviceRepositoryItem.name, () => __awaiter(this, void 0, void 0, function* () {
            if (serviceRepositoryItem.instance.setOptions) {
                serviceRepositoryItem.context.log.debug('setOptions');
                yield serviceRepositoryItem.instance.setOptions(options);
            }
        }));
    }
    loadService(moduleName, serviceName) {
        const serviceKey = moduleName + '.' + serviceName;
        return commandResultWrapper_1.command('loadService', serviceKey, (result) => __awaiter(this, void 0, void 0, function* () {
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
            let services;
            try {
                result.log.push('Loading: ' + moduleDefinition.serverFile);
                const serverFileExport = require(moduleDefinition.serverFile);
                services = serverFileExport && serverFileExport.services;
            }
            catch (error) {
                throw new Error('Error loading Module: ' + moduleDefinition.serverFile);
            }
            if (!services || !Array.isArray(services)) {
                throw new Error('No services found for module: ' + moduleName);
            }
            const serviceDefinition = services.find(x => x.name === serviceName);
            if (!serviceDefinition) {
                throw new Error('Service not found: ' + serviceName);
            }
            const serviceContext = ReactronServiceContext_1.ReactronServiceContext.getServiceContext(moduleName, serviceName);
            const serviceInstance = new serviceDefinition.service(serviceContext);
            // get / init service options
            let serviceOptions = this.optionsRepository.get(moduleName, serviceName);
            if (!serviceOptions) {
                serviceOptions = this.getDefaultObjectOptions(serviceDefinition.fields);
                this.optionsRepository.set(moduleName, serviceName, serviceOptions);
                console.log('Initializing Service Options for ' + serviceKey, serviceOptions);
            }
            const serviceRepositoryItem = Object.assign({}, serviceDefinition, { moduleName, instance: serviceInstance, context: serviceContext, state: 'stopped' });
            this.serviceRepository.add(serviceRepositoryItem);
            result.children.push(yield this.setOptionsInternal(serviceRepositoryItem, serviceOptions));
            result.children.push(yield this.startService(serviceRepositoryItem));
        }));
    }
    getDefaultObjectOptions(fields) {
        const result = {};
        if (fields) {
            fields.forEach(field => {
                result[field.name] = this.getDefaultFieldOptions(field);
            });
        }
        return result;
    }
    getDefaultFieldOptions(fieldDefinition) {
        let result = fieldDefinition.defaultValue;
        if (fieldDefinition.isArray) {
            result = result || [];
        }
        else if (fieldDefinition.valueType === 'object') {
            result = result || this.getDefaultObjectOptions(fieldDefinition.fields);
        }
        return result;
    }
}
exports.ServiceManager = ServiceManager;
//# sourceMappingURL=ServiceManager.js.map