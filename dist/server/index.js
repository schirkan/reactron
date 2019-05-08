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
const electron_1 = require("electron");
const BackendService_1 = require("./BackendService");
const config_1 = require("./config");
exports.start = (root) => __awaiter(this, void 0, void 0, function* () {
    if (BackendService_1.BackendService.instance) {
        return;
    }
    console.log('BackendService is starting');
    const config = yield config_1.createConfig(root);
    BackendService_1.BackendService.instance = new BackendService_1.BackendService(config);
    yield BackendService_1.BackendService.instance.expressApp.start();
    yield BackendService_1.BackendService.instance.electronApp.start();
    BackendService_1.BackendService.instance.moduleManager.loadAllModules();
    // internal module
    let internalModule = BackendService_1.BackendService.instance.moduleManager.get('reactron');
    if (!internalModule) {
        internalModule = BackendService_1.BackendService.instance.moduleManager.localModuleHandler.loadModule('../');
    }
    if (internalModule) {
        internalModule.canRemove = false;
        internalModule.serverFile = './internalModule/index';
        BackendService_1.BackendService.instance.moduleRepository.add(internalModule);
    }
    else {
        throw new Error('Could not load internalModule');
    }
    yield BackendService_1.BackendService.instance.serviceManager.startAllServices();
    BackendService_1.BackendService.instance.expressApp.registerErrorHandler();
    electron_1.app.on('before-quit', () => BackendService_1.BackendService.instance.serviceManager.stopAllServices());
    BackendService_1.BackendService.instance.electronApp.mainWindow.loadURL('http://localhost:' + BackendService_1.BackendService.instance.config.frontendPort + BackendService_1.BackendService.instance.settings.get().startupPath);
    console.log('BackendService is running');
});
//# sourceMappingURL=index.js.map