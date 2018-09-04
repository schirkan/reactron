"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var Store = require('electron-store');
var OptionsRepository = /** @class */ (function () {
    function OptionsRepository() {
        this.repository = new Store({
            name: 'OptionsRepository',
        });
    }
    OptionsRepository.prototype.getServiceOptions = function (moduleName, serviceName) {
        var key = moduleName + '.service.' + serviceName;
        return this.repository.get(key);
    };
    OptionsRepository.prototype.getComponentOptions = function (moduleName, componentName) {
        var key = moduleName + '.component.' + componentName;
        return this.repository.get(key);
    };
    OptionsRepository.prototype.setServiceOptions = function (moduleName, serviceName, options) {
        var key = moduleName + '.service.' + serviceName;
        this.repository.set(key, options);
    };
    OptionsRepository.prototype.setComponentOptions = function (moduleName, componentName, options) {
        var key = moduleName + '.component.' + componentName;
        this.repository.set(key, options);
    };
    return OptionsRepository;
}());
exports.OptionsRepository = OptionsRepository;
//# sourceMappingURL=OptionsRepository.js.map