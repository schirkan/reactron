"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// dependency loader für services
var ServiceManager = /** @class */ (function () {
    function ServiceManager(serviceRepository, moduleRepository) {
        this.serviceRepository = serviceRepository;
        this.moduleRepository = moduleRepository;
    }
    ServiceManager.prototype.get = function (serviceName, moduleName) {
        return this.serviceRepository.get(moduleName, serviceName);
    };
    ServiceManager.prototype.getAll = function () {
        return this.serviceRepository.getAll();
    };
    return ServiceManager;
}());
exports.ServiceManager = ServiceManager;
//# sourceMappingURL=ServiceManager.js.map