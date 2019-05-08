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
const BackendService_1 = require("./BackendService");
const LogWriter_1 = require("./../common/LogWriter");
const ReactronServicesBackend_1 = require("./ReactronServicesBackend");
// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');
class ReactronServiceContext {
    constructor(moduleName, serviceName) {
        this.moduleName = moduleName;
        this.serviceName = serviceName;
        this.moduleContext = InternalModuleContext.getModuleContext(this.moduleName);
        this.log = new LogWriter_1.LogWriter(BackendService_1.BackendService.instance.topics, moduleName + '.' + serviceName);
    }
    get moduleStorage() {
        return this.moduleContext.moduleStorage;
    }
    get moduleApiRouter() {
        return this.moduleContext.moduleApiRouter;
    }
    get topics() {
        return BackendService_1.BackendService.instance.topics;
    }
    get settings() {
        return BackendService_1.BackendService.instance.settings.get();
    }
    get services() {
        return ReactronServicesBackend_1.ReactronServicesBackend.instance;
    }
    getService(serviceName, moduleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BackendService_1.BackendService.instance.serviceManager.getAsync(moduleName || this.moduleName, serviceName);
        });
    }
    static getServiceContext(moduleName, serviceName) {
        let context = ReactronServiceContext.serviceContexts.find(x => x.moduleName === moduleName && x.serviceName === serviceName);
        if (!context) {
            context = new ReactronServiceContext(moduleName, serviceName);
            ReactronServiceContext.serviceContexts.push(context);
        }
        return context;
    }
}
ReactronServiceContext.serviceContexts = [];
exports.ReactronServiceContext = ReactronServiceContext;
class InternalModuleContext {
    constructor(moduleName) {
        this.moduleName = moduleName;
        this.moduleStorage = new Store({ name: 'module.' + moduleName });
        this.moduleApiRouter = express.Router();
        const escapedModuleName = moduleName.replace('/', '@');
        BackendService_1.BackendService.instance.expressApp.apiRouter.use('/' + escapedModuleName, this.moduleApiRouter);
    }
    static getModuleContext(moduleName) {
        let context = InternalModuleContext.moduleContexts.find(x => x.moduleName === moduleName);
        if (!context) {
            context = new InternalModuleContext(moduleName);
            InternalModuleContext.moduleContexts.push(context);
        }
        return context;
    }
}
InternalModuleContext.moduleContexts = [];
//# sourceMappingURL=ReactronServiceContext.js.map