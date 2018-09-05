"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var Store = require('electron-store');
var ServiceOptionsRepository = /** @class */ (function () {
    function ServiceOptionsRepository() {
        this.repository = new Store({
            name: 'ServiceOptionsRepository',
        });
    }
    ServiceOptionsRepository.prototype.get = function (moduleName, serviceName) {
        var key = moduleName + '.' + serviceName;
        return this.repository.get(key);
    };
    ServiceOptionsRepository.prototype.set = function (moduleName, serviceName, options) {
        var key = moduleName + '.' + serviceName;
        this.repository.set(key, options);
    };
    return ServiceOptionsRepository;
}());
exports.ServiceOptionsRepository = ServiceOptionsRepository;
//# sourceMappingURL=ServiceOptionsRepository.js.map