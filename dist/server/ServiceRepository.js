"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceRepository = /** @class */ (function () {
    function ServiceRepository() {
        this.services = [];
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
    }
    ServiceRepository.prototype.add = function (service) {
        if (this.get(service.moduleName, service.name)) {
            throw Error('Service allready registered: ' + service.name);
        }
        this.services.push(service);
    };
    ServiceRepository.prototype.remove = function (moduleName, serviceName) {
        var index = this.services.findIndex(function (x) { return x.moduleName === moduleName && x.name === serviceName; });
        if (index >= 0) {
            this.services.splice(index, 1);
        }
    };
    ServiceRepository.prototype.get = function (moduleName, serviceName) {
        return this.services.find(function (x) { return x.moduleName === moduleName && x.name === serviceName; });
    };
    ServiceRepository.prototype.getAll = function () {
        return this.services.slice(); // copy
    };
    return ServiceRepository;
}());
exports.ServiceRepository = ServiceRepository;
//# sourceMappingURL=ServiceRepository.js.map