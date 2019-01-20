"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceRepository {
    constructor() {
        this.services = [];
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
    }
    add(service) {
        if (this.get(service.moduleName, service.name)) {
            throw Error('Service allready registered: ' + service.name);
        }
        this.services.push(service);
    }
    remove(moduleName, serviceName) {
        const index = this.services.findIndex(x => x.moduleName === moduleName && x.name === serviceName);
        if (index >= 0) {
            this.services.splice(index, 1);
        }
    }
    get(moduleName, serviceName) {
        return this.services.find(x => x.moduleName === moduleName && x.name === serviceName);
    }
    getAll() {
        return this.services.slice(); // copy
    }
}
exports.ServiceRepository = ServiceRepository;
//# sourceMappingURL=ServiceRepository.js.map