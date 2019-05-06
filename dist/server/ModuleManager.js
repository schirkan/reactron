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
const path = require("path");
const commandResultWrapper_1 = require("./commandResultWrapper");
const SystemCommand_1 = require("./SystemCommand");
const NpmModuleHandler_1 = require("./moduleHandler/NpmModuleHandler");
const LocalModuleHandler_1 = require("./moduleHandler/LocalModuleHandler");
const ModuleHelper_1 = require("./ModuleHelper");
class ModuleManager {
    constructor(config, moduleRepository) {
        this.config = config;
        this.moduleRepository = moduleRepository;
        this.localModuleHandler = new LocalModuleHandler_1.LocalModuleHandler(config, moduleRepository);
        this.npmModuleHandler = new NpmModuleHandler_1.NpmModuleHandler(config, moduleRepository);
        this.moduleHandler = [this.npmModuleHandler, this.localModuleHandler];
        this.modulesRootPath = path.join(this.config.root, 'modules');
    }
    loadAllModules() {
        this.moduleHandler.forEach(handler => {
            const modules = handler.loadAllModules();
            modules.forEach(this.moduleRepository.add);
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
            const result1 = yield SystemCommand_1.SystemCommand.run('npm update', this.modulesRootPath);
            result.children.push(result1);
            const result2 = yield SystemCommand_1.SystemCommand.run('npm audit fix', this.modulesRootPath);
            result.children.push(result2);
            const result3 = yield commandResultWrapper_1.command('refreshModules', undefined, () => __awaiter(this, void 0, void 0, function* () {
                this.moduleRepository.getAll().forEach(m => ModuleHelper_1.refreshModule(m));
            }));
            result.children.push(result3);
        }));
        // const moduleRepositoryItems = BackendService.instance.moduleManager.getAll().filter(x => x.hasUpdate);
        // const results: ICommandResult[] = [];
        // for (const moduleRepositoryItem of moduleRepositoryItems) {
        //   const resultUpdate = await BackendService.instance.moduleManager.update(moduleRepositoryItem);
        //   results.push(resultUpdate);
        // }
        // return [];
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