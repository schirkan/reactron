"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');
class ServiceOptionsRepository {
    constructor() {
        this.repository = new Store({
            name: 'ServiceOptionsRepository',
        });
    }
    get(moduleName, serviceName) {
        const key = moduleName + '.' + serviceName;
        return this.repository.get(key);
    }
    set(moduleName, serviceName, options) {
        const key = moduleName + '.' + serviceName;
        this.repository.set(key, options);
    }
}
exports.ServiceOptionsRepository = ServiceOptionsRepository;
//# sourceMappingURL=ServiceOptionsRepository.js.map