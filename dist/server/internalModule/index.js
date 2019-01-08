"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppController_1 = require("./AppController");
var ModuleController_1 = require("./ModuleController");
var ServiceController_1 = require("./ServiceController");
var SettingsController_1 = require("./SettingsController");
var WebComponentController_1 = require("./WebComponentController");
var WebPageController_1 = require("./WebPageController");
var RefreshController_1 = require("./RefreshController");
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
        name: 'SettingsController',
        displayName: 'SystemSettings API',
        description: 'API Controller for SystemSettings',
        service: SettingsController_1.SettingsController
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
    }];
//# sourceMappingURL=index.js.map