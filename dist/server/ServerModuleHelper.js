"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var BackendService_1 = require("../server/BackendService");
// tslint:disable-next-line:no-var-requires
var Store = require('electron-store');
var ServerModuleHelper = /** @class */ (function () {
    function ServerModuleHelper(moduleName) {
        this.moduleName = moduleName;
        this.backendService = BackendService_1.BackendService.instance;
        this.moduleStorage = new Store({ name: 'module.' + moduleName });
        this.moduleApiRouter = express_1.Router();
        this.backendService.expressApp.apiRouter.use('/modules/' + moduleName, this.moduleApiRouter);
    }
    ServerModuleHelper.prototype.getService = function (serviceName, moduleName) {
        return this.backendService.serviceManager.get(moduleName || this.moduleName, serviceName);
    };
    ServerModuleHelper.getServerModuleHelpers = function (moduleName) {
        var helper = ServerModuleHelper.serverModuleHelpers.find(function (x) { return x.moduleName === moduleName; });
        if (!helper) {
            helper = new ServerModuleHelper(moduleName);
            ServerModuleHelper.serverModuleHelpers.push(helper);
        }
        return helper;
    };
    ServerModuleHelper.serverModuleHelpers = [];
    return ServerModuleHelper;
}());
exports.ServerModuleHelper = ServerModuleHelper;
//# sourceMappingURL=ServerModuleHelper.js.map