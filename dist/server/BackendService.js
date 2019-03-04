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
const path = require("path");
const ElectronApp_1 = require("./ElectronApp");
const ExpressApp_1 = require("./ExpressApp");
const ModuleManager_1 = require("./ModuleManager");
const ModuleRepository_1 = require("./ModuleRepository");
const PubSub_1 = require("./PubSub");
const ServiceManager_1 = require("./ServiceManager");
const ServiceOptionsRepository_1 = require("./ServiceOptionsRepository");
const ServiceRepository_1 = require("./ServiceRepository");
const SystemCommand_1 = require("./SystemCommand");
const SystemSettingsManager_1 = require("./SystemSettingsManager");
const WebComponentsManager_1 = require("./WebComponentsManager");
const WebPageManager_1 = require("./WebPageManager");
const LogManager_1 = require("./LogManager");
class BackendService {
    constructor(config) {
        this.config = config;
        this.topics = new PubSub_1.PubSub();
        this.moduleRepository = new ModuleRepository_1.ModuleRepository();
        this.serviceRepository = new ServiceRepository_1.ServiceRepository();
        this.serviceOptionsRepository = new ServiceOptionsRepository_1.ServiceOptionsRepository();
        this.electronApp = new ElectronApp_1.ElectronApp(this.config);
        this.expressApp = new ExpressApp_1.ExpressApp(this.config);
        this.serviceManager = new ServiceManager_1.ServiceManager(this.serviceRepository, this.moduleRepository, this.serviceOptionsRepository);
        this.moduleManager = new ModuleManager_1.ModuleManager(this.config, this.moduleRepository);
        this.webPageManager = new WebPageManager_1.WebPageManager(this.topics, this.config.defaultWebPageOptions);
        this.webComponentsManager = new WebComponentsManager_1.WebComponentsManager(this.topics, this.config.defaultWebComponentOptions);
        this.settings = new SystemSettingsManager_1.SystemSettingsManager(this.topics, this.config.defaultSystemSettings);
        this.logManager = new LogManager_1.LogManager(this.topics);
    }
    exit() {
        this.electronApp.mainWindow.close();
        electron_1.app.quit();
    }
    restart() {
        electron_1.app.relaunch();
        electron_1.app.quit();
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            const appPath = electron_1.app.getPath('userData');
            const cwd = path.join(appPath, '../');
            const result = yield SystemCommand_1.SystemCommand.run('rimraf ' + appPath, cwd);
            console.log(result);
            electron_1.app.relaunch();
            electron_1.app.quit();
        });
    }
}
exports.BackendService = BackendService;
//# sourceMappingURL=BackendService.js.map