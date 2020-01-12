"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BackendService_1 = require("../BackendService");
class ModuleController {
    start() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return BackendService_1.BackendService.instance.moduleManager.getAll();
        });
    }
    add(repository) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield BackendService_1.BackendService.instance.moduleManager.add(repository);
            return [result];
        });
    }
    remove(moduleName) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleRepositoryItem = BackendService_1.BackendService.instance.moduleManager.get(moduleName);
            if (moduleRepositoryItem) {
                const result = yield BackendService_1.BackendService.instance.moduleManager.remove(moduleRepositoryItem);
                return [result];
            }
            else {
                throw new Error('not found');
            }
        });
    }
    updateAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const resultUpdateAll = yield BackendService_1.BackendService.instance.moduleManager.updateAll();
            return [resultUpdateAll];
        });
    }
    update(moduleName) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleRepositoryItem = BackendService_1.BackendService.instance.moduleManager.get(moduleName);
            if (moduleRepositoryItem) {
                const results = [];
                if (moduleRepositoryItem.hasUpdate) {
                    const resultUpdate = yield BackendService_1.BackendService.instance.moduleManager.update(moduleRepositoryItem);
                    results.push(resultUpdate);
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
            const resultCheckUpdates = yield BackendService_1.BackendService.instance.moduleManager.checkUpdates();
            return [resultCheckUpdates];
        });
    }
}
exports.ModuleController = ModuleController;
//# sourceMappingURL=ModuleController.js.map