"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppController_1 = require("./AppController");
const ModuleController_1 = require("./ModuleController");
const ServiceController_1 = require("./ServiceController");
const WebComponentController_1 = require("./WebComponentController");
const WebPageController_1 = require("./WebPageController");
const RefreshController_1 = require("./RefreshController");
const LogController_1 = require("./LogController");
exports.services = [{
        name: 'ModuleController',
        displayName: 'Modules API',
        description: 'API Controller for Modules',
        service: ModuleController_1.ModuleController
    }, {
        name: 'ServiceController',
        displayName: 'Service API',
        description: 'API Controller for Services',
        service: ServiceController_1.ServiceController
    }, {
        name: 'WebPageController',
        displayName: 'WebPages API',
        description: 'API Controller for WebPages',
        service: WebPageController_1.WebPageController
    }, {
        name: 'WebComponentController',
        displayName: 'WebComponents API',
        description: 'API Controller for WebComponents',
        service: WebComponentController_1.WebComponentController
    }, {
        name: 'AppController',
        displayName: 'Application API',
        description: 'API Controller for Application',
        service: AppController_1.AppController
    }, {
        name: 'RefreshController',
        displayName: 'Refresh Controller',
        description: 'Auto Refresh Controller',
        service: RefreshController_1.RefreshController
    }, {
        name: 'LogController',
        displayName: 'Log Controller',
        description: 'API Controller for Logging',
        service: LogController_1.LogController
    }];
//# sourceMappingURL=index.js.map