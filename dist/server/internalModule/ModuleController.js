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
const apiRoutes_1 = require("../../common/apiRoutes");
class ModuleController {
    constructor(context) {
        this.context = context;
    }
    getModules() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.context.backendService.moduleManager.getAll();
        });
    }
    addModule(repository) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            const resultAdd = yield this.context.backendService.moduleManager.add(repository);
            results.push(resultAdd);
            if (resultAdd.success && resultAdd.data) {
                const moduleRepositoryItem = resultAdd.data;
                if (moduleRepositoryItem.isBuilded) {
                    const resultInstall = yield this.context.backendService.moduleManager.install(moduleRepositoryItem, true);
                    results.push(resultInstall);
                }
                else {
                    const resultInstall = yield this.context.backendService.moduleManager.install(moduleRepositoryItem, false);
                    results.push(resultInstall);
                    const resultBuild = yield this.context.backendService.moduleManager.build(moduleRepositoryItem);
                    results.push(resultBuild);
                }
            }
            return results;
        });
    }
    deleteModule(moduleName) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleRepositoryItem = this.context.backendService.moduleManager.get(moduleName);
            if (moduleRepositoryItem) {
                const result = yield this.context.backendService.moduleManager.remove(moduleRepositoryItem);
                return [result];
            }
            else {
                throw new Error('not found');
            }
        });
    }
    rebuildModule(moduleName) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleRepositoryItem = this.context.backendService.moduleManager.get(moduleName);
            if (moduleRepositoryItem) {
                const resultInstall = yield this.context.backendService.moduleManager.install(moduleRepositoryItem, false);
                const resultBuild = yield this.context.backendService.moduleManager.build(moduleRepositoryItem);
                return [resultInstall, resultBuild];
            }
            else {
                throw new Error('not found');
            }
        });
    }
    updateModule(moduleName) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleRepositoryItem = this.context.backendService.moduleManager.get(moduleName);
            if (moduleRepositoryItem) {
                const results = [];
                if (moduleRepositoryItem.hasUpdate) {
                    const resultUpdate = yield this.context.backendService.moduleManager.update(moduleRepositoryItem);
                    results.push(resultUpdate);
                    if (moduleRepositoryItem.isBuilded) {
                        const resultInstall = yield this.context.backendService.moduleManager.install(moduleRepositoryItem, true);
                        results.push(resultInstall);
                    }
                    else {
                        const resultInstall = yield this.context.backendService.moduleManager.install(moduleRepositoryItem, false);
                        results.push(resultInstall);
                        const resultBuild = yield this.context.backendService.moduleManager.build(moduleRepositoryItem);
                        results.push(resultBuild);
                    }
                }
                return results;
            }
            else {
                throw new Error('not found');
            }
        });
    }
    checkUpdates() {
        return __awaiter(this, void 0, void 0, function* () {
            const resultCheckUpdates = yield this.context.backendService.moduleManager.checkUpdates();
            return [resultCheckUpdates];
        });
    }
    // -----------------
    start(context) {
        return __awaiter(this, void 0, void 0, function* () {
            context.registerRoute(apiRoutes_1.routes.getModules, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const modules = context.backendService.moduleManager.getAll();
                res.send(modules);
            }));
            context.registerRoute(apiRoutes_1.routes.checkUpdates, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const resultCheckUpdates = yield context.backendService.moduleManager.checkUpdates();
                res.send([resultCheckUpdates]);
            }));
            context.registerRoute(apiRoutes_1.routes.addModule, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const results = [];
                const resultAdd = yield context.backendService.moduleManager.add(req.body.repository);
                results.push(resultAdd);
                if (resultAdd.success && resultAdd.data) {
                    const moduleRepositoryItem = resultAdd.data;
                    if (moduleRepositoryItem.isBuilded) {
                        const resultInstall = yield context.backendService.moduleManager.install(moduleRepositoryItem, true);
                        results.push(resultInstall);
                    }
                    else {
                        const resultInstall = yield context.backendService.moduleManager.install(moduleRepositoryItem, false);
                        results.push(resultInstall);
                        const resultBuild = yield context.backendService.moduleManager.build(moduleRepositoryItem);
                        results.push(resultBuild);
                    }
                }
                res.send(results);
            }));
            context.registerRoute(apiRoutes_1.routes.deleteModule, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const moduleRepositoryItem = context.backendService.moduleManager.get(req.body.moduleName);
                if (moduleRepositoryItem) {
                    const result = yield context.backendService.moduleManager.remove(moduleRepositoryItem);
                    res.send([result]);
                }
                else {
                    res.sendStatus(404);
                }
            }));
            context.registerRoute(apiRoutes_1.routes.rebuildModule, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const moduleRepositoryItem = context.backendService.moduleManager.get(req.body.moduleName);
                if (moduleRepositoryItem) {
                    const resultInstall = yield context.backendService.moduleManager.install(moduleRepositoryItem, false);
                    const resultBuild = yield context.backendService.moduleManager.build(moduleRepositoryItem);
                    res.send([resultInstall, resultBuild]);
                }
                else {
                    res.sendStatus(404);
                }
            }));
            context.registerRoute(apiRoutes_1.routes.updateModule, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const moduleRepositoryItem = context.backendService.moduleManager.get(req.body.moduleName);
                if (moduleRepositoryItem) {
                    const results = [];
                    if (moduleRepositoryItem.hasUpdate) {
                        const resultUpdate = yield context.backendService.moduleManager.update(moduleRepositoryItem);
                        results.push(resultUpdate);
                        if (moduleRepositoryItem.isBuilded) {
                            const resultInstall = yield context.backendService.moduleManager.install(moduleRepositoryItem, true);
                            results.push(resultInstall);
                        }
                        else {
                            const resultInstall = yield context.backendService.moduleManager.install(moduleRepositoryItem, false);
                            results.push(resultInstall);
                            const resultBuild = yield context.backendService.moduleManager.build(moduleRepositoryItem);
                            results.push(resultBuild);
                        }
                    }
                    res.send(results);
                }
                else {
                    res.sendStatus(404);
                }
            }));
        });
    }
}
exports.ModuleController = ModuleController;
//# sourceMappingURL=ModuleController.js.map