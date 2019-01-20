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
// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');
class ReactronServiceContext {
    constructor(moduleName, serviceName) {
        this.moduleName = moduleName;
        this.serviceName = serviceName;
        this.backendService = BackendService_1.BackendService.instance;
        this.registerRoute = (route, handler) => {
            this.log.debug('Register route: ' + route.method + ' ' + route.path);
            const router = this.moduleApiRouter;
            const method = router[route.method.toLowerCase()].bind(router);
            const internalHandler = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let data = undefined;
                    if (req.params && Object.keys(req.params).length) {
                        data = req.params;
                    }
                    this.log.debug('Call route: ' + route.method + ' ' + route.path, data);
                    yield handler(req, res, next);
                }
                catch (error) {
                    this.log.error('Error in route: ' + route.method + ' ' + route.path, error && error.message || error);
                }
            });
            method(route.path, internalHandler);
        };
        this.moduleContext = InternalModuleContext.getModuleContext(this.backendService, this.moduleName);
        this.log = new LogWriter_1.LogWriter(this.backendService.topics, moduleName + '.' + serviceName);
        // this.log.debug('Module Api Path: ' + this.moduleContext.moduleApiPath);
    }
    get moduleStorage() {
        return this.moduleContext.moduleStorage;
    }
    get moduleApiRouter() {
        return this.moduleContext.moduleApiRouter;
    }
    get settings() {
        return this.backendService.settings.get();
    }
    getService(serviceName, moduleName) {
        return this.backendService.serviceManager.get(moduleName || this.moduleName, serviceName);
    }
    getServiceAsync(serviceName, moduleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.backendService.serviceManager.getAsync(moduleName || this.moduleName, serviceName);
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
    constructor(backendService, moduleName) {
        this.moduleName = moduleName;
        this.moduleStorage = new Store({ name: 'module.' + moduleName });
        this.moduleApiRouter = express.Router();
        const escapedModuleName = moduleName.replace('/', '@');
        this.moduleApiPath = '/modules/' + escapedModuleName;
        backendService.expressApp.apiRouter.use(this.moduleApiPath, this.moduleApiRouter);
    }
    static getModuleContext(backendService, moduleName) {
        let context = InternalModuleContext.moduleContexts.find(x => x.moduleName === moduleName);
        if (!context) {
            context = new InternalModuleContext(backendService, moduleName);
            InternalModuleContext.moduleContexts.push(context);
        }
        return context;
    }
}
InternalModuleContext.moduleContexts = [];
//# sourceMappingURL=ReactronServiceContext.js.map