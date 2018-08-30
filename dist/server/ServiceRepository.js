"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceRepository = /** @class */ (function () {
    function ServiceRepository() {
        this.services = {};
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
    }
    ServiceRepository.prototype.add = function (moduleName, serviceName, instance) {
        var key = moduleName + '.' + serviceName;
        if (this.services[key]) {
            throw Error('Service allready registered: ' + key);
        }
        this.services[key] = instance;
    };
    ServiceRepository.prototype.remove = function (moduleName, serviceName) {
        var key = moduleName + '.' + serviceName;
        delete (this.services[key]);
    };
    ServiceRepository.prototype.get = function (moduleName, serviceName) {
        var key = moduleName + '.' + serviceName;
        return this.services[key];
    };
    ServiceRepository.prototype.getAll = function (moduleName) {
        var _this = this;
        if (moduleName) {
            var result_1 = {};
            var foundKeys = Object.keys(this.services).filter(function (x) { return x.startsWith(moduleName + '.'); });
            if (foundKeys) {
                foundKeys.forEach(function (key) {
                    result_1[key] = _this.services[key];
                });
            }
            return result_1;
        }
        return Object.assign({}, this.services); // copy
    };
    return ServiceRepository;
}());
exports.ServiceRepository = ServiceRepository;
//# sourceMappingURL=ServiceRepository.js.map