"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const commandResultWrapper_1 = require("./commandResultWrapper");
const NpmModuleHandler_1 = require("./moduleHandler/NpmModuleHandler");
const LocalModuleHandler_1 = require("./moduleHandler/LocalModuleHandler");
const ModuleHelper_1 = require("./ModuleHelper");
const BackendService_1 = require("./BackendService");
class ModuleManager {
    constructor(config, moduleRepository) {
        this.config = config;
        this.moduleRepository = moduleRepository;
        this.localModuleHandler = new LocalModuleHandler_1.LocalModuleHandler(config, moduleRepository);
        this.npmModuleHandler = new NpmModuleHandler_1.NpmModuleHandler(config, moduleRepository);
        this.moduleHandler = [this.npmModuleHandler, this.localModuleHandler];
    }
    loadAllModules() {
        this.moduleHandler.forEach(handler => {
            const modules = handler.loadAllModules();
            for (const m of modules) {
                this.moduleRepository.add(m);
                const escapedModuleName = m.name.replace('/', '@');
                const expressInstance = BackendService_1.BackendService.instance.expressApp.express;
                expressInstance.use('/modules/' + escapedModuleName, express.static(m.path));
            }
        });
    }
    getAll() {
        return this.moduleRepository.getAll();
    }
    get(moduleName) {
        return this.moduleRepository.get(moduleName);
    }
    findAddHandler(repository) {
        return __awaiter(this, void 0, void 0, function* () {
            const handlerPromise = this.moduleHandler.map((x) => __awaiter(this, void 0, void 0, function* () { return (yield x.canAdd(repository)) ? x : undefined; }));
            return Promise.all(handlerPromise).then(handler => handler.find(x => !!x));
        });
    }
    findUpdateHandler(moduleDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            const handlerPromise = this.moduleHandler.map((x) => __awaiter(this, void 0, void 0, function* () { return (yield x.canUpdate(moduleDefinition)) ? x : undefined; }));
            return Promise.all(handlerPromise).then(handler => handler.find(x => !!x));
        });
    }
    findRemoveHandler(moduleDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            const handlerPromise = this.moduleHandler.map((x) => __awaiter(this, void 0, void 0, function* () { return (yield x.canRemove(moduleDefinition)) ? x : undefined; }));
            return Promise.all(handlerPromise).then(handler => handler.find(x => !!x));
        });
    }
    add(repository) {
        return __awaiter(this, void 0, void 0, function* () {
            const handler = yield this.findAddHandler(repository);
            if (!handler) {
                throw new Error('No AddHandler for this repository.');
            }
            return handler.add(repository);
        });
    }
    updateAll() {
        return commandResultWrapper_1.command('updateAll', undefined, (result) => __awaiter(this, void 0, void 0, function* () {
            // update all modules with updates
            const modulesWithUpdates = this.moduleRepository.getAll().filter(x => x.hasUpdate);
            const updateResults = yield Promise.all(modulesWithUpdates.map(m => this.update(m)));
            result.children.push(...updateResults);
            // run updateAll methods
            const updateAllHandler = this.moduleHandler.filter(x => x.updateAllModules !== undefined);
            const updateAllResults = yield Promise.all(updateAllHandler.map(x => x.updateAllModules()));
            result.children.push(...updateAllResults);
            const refreshModulesResult = yield commandResultWrapper_1.command('refreshModules', undefined, () => __awaiter(this, void 0, void 0, function* () {
                this.moduleRepository.getAll().forEach(m => ModuleHelper_1.refreshModule(m));
            }));
            result.children.push(refreshModulesResult);
        }));
    }
    update(moduleDefinition) {
        return commandResultWrapper_1.command('update', moduleDefinition && moduleDefinition.name, () => __awaiter(this, void 0, void 0, function* () {
            if (!moduleDefinition) {
                throw new Error('Can not update module');
            }
            const handler = yield this.findUpdateHandler(moduleDefinition);
            if (!handler) {
                throw new Error('No UpdateHandler for this module.');
            }
            return handler.update(moduleDefinition);
        }));
    }
    remove(moduleDefinition) {
        return commandResultWrapper_1.command('remove', moduleDefinition && moduleDefinition.name, () => __awaiter(this, void 0, void 0, function* () {
            if (!moduleDefinition || !moduleDefinition.canRemove) {
                throw new Error('Can not remove module');
            }
            const handler = yield this.findRemoveHandler(moduleDefinition);
            if (!handler) {
                throw new Error('No RemoveHandler for this module.');
            }
            return handler.remove(moduleDefinition);
        }));
    }
    checkUpdates() {
        return commandResultWrapper_1.command('checkUpdates', undefined, (result) => __awaiter(this, void 0, void 0, function* () {
            const modulesWithUpdate = [];
            const modules = this.moduleRepository.getAll();
            for (const moduleDefinition of modules) {
                const handler = yield this.findUpdateHandler(moduleDefinition);
                if (handler) {
                    const resultHasUpdate = yield handler.hasUpdate(moduleDefinition);
                    result.children.push(resultHasUpdate);
                    moduleDefinition.hasUpdate = resultHasUpdate.data;
                    if (moduleDefinition.hasUpdate) {
                        modulesWithUpdate.push(moduleDefinition.name);
                    }
                }
                else {
                    moduleDefinition.hasUpdate = false;
                }
            }
            return modulesWithUpdate;
        }));
    }
}
exports.ModuleManager = ModuleManager;
//# sourceMappingURL=ModuleManager.js.map