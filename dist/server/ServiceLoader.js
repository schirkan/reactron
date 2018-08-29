"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// dependency loader für services
var ServiceLoader = /** @class */ (function () {
    function ServiceLoader(moduleRepository) {
        this.moduleRepository = moduleRepository;
        this.services = {};
    }
    ServiceLoader.prototype.getService = function (serviceName, moduleName) {
        return this.services[moduleName + '.' + serviceName];
        // TODO
    };
    ServiceLoader.prototype.getServices = function () {
        return this.services;
        // TODO
    };
    return ServiceLoader;
}());
exports.ServiceLoader = ServiceLoader;
//# sourceMappingURL=ServiceLoader.js.map