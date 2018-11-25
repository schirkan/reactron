"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ModuleRepository = /** @class */ (function () {
    function ModuleRepository() {
        this.modules = [];
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
    }
    ModuleRepository.prototype.add = function (module) {
        if (this.get(module.name)) {
            throw Error('Module allready registered: ' + module.name);
        }
        this.modules.push(module);
    };
    ModuleRepository.prototype.remove = function (moduleName) {
        var index = this.modules.findIndex(function (x) { return x.name === moduleName; });
        if (index >= 0) {
            this.modules.splice(index, 1);
        }
    };
    ModuleRepository.prototype.get = function (moduleName) {
        return this.modules.find(function (x) { return x.name === moduleName; });
    };
    ModuleRepository.prototype.getAll = function () {
        return this.modules.slice(); // copy
    };
    return ModuleRepository;
}());
exports.ModuleRepository = ModuleRepository;
//# sourceMappingURL=ModuleRepository.js.map