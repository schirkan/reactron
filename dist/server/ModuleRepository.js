"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModuleRepository {
    constructor() {
        this.modules = [];
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
    }
    add(module) {
        if (this.get(module.name)) {
            throw Error('Module allready registered: ' + module.name);
        }
        this.modules.push(module);
    }
    remove(moduleName) {
        const index = this.modules.findIndex(x => x.name === moduleName);
        if (index >= 0) {
            this.modules.splice(index, 1);
        }
    }
    get(moduleName) {
        return this.modules.find(x => x.name === moduleName);
    }
    getAll() {
        return this.modules.slice(); // copy
    }
}
exports.ModuleRepository = ModuleRepository;
//# sourceMappingURL=ModuleRepository.js.map