"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BackendService_1 = require("./BackendService");
class ReactronServicesBackend {
    get modules() {
        if (!this._modules) {
            this._modules = BackendService_1.BackendService.instance.serviceManager.get('reactron', 'ModuleController');
        }
        return this._modules;
    }
    get application() {
        if (!this._application) {
            this._application = BackendService_1.BackendService.instance.serviceManager.get('reactron', 'AppController');
        }
        return this._application;
    }
    get log() {
        if (!this._log) {
            this._log = BackendService_1.BackendService.instance.serviceManager.get('reactron', 'LogController');
        }
        return this._log;
    }
    get services() {
        if (!this._services) {
            this._services = BackendService_1.BackendService.instance.serviceManager.get('reactron', 'ServiceController');
        }
        return this._services;
    }
    get components() {
        if (!this._components) {
            this._components = BackendService_1.BackendService.instance.serviceManager.get('reactron', 'WebComponentController');
        }
        return this._components;
    }
    get pages() {
        if (!this._pages) {
            this._pages = BackendService_1.BackendService.instance.serviceManager.get('reactron', 'WebPageController');
        }
        return this._pages;
    }
}
exports.ReactronServicesBackend = ReactronServicesBackend;
ReactronServicesBackend.instance = new ReactronServicesBackend();
//# sourceMappingURL=ReactronServicesBackend.js.map