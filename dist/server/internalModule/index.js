"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ModuleController_1 = require("./ModuleController");
var ServiceController_1 = require("./ServiceController");
var SettingsController_1 = require("./SettingsController");
var WebComponentController_1 = require("./WebComponentController");
var WebPageController_1 = require("./WebPageController");
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
    }];
//# sourceMappingURL=index.js.map