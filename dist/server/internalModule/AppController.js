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
const os = require("os");
const BackendService_1 = require("../BackendService");
// tslint:disable-next-line:no-var-requires
const osCommand = require('electron-shutdown-command');
const getIPAddress = () => {
    const list = [];
    const interfaces = os.networkInterfaces();
    const devices = Object.keys(interfaces);
    for (const devName of devices) {
        const iface = interfaces[devName];
        for (const alias of iface) {
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                list.push(alias.address);
            }
        }
    }
    if (list.length > 1) {
        const lanIp = list.find(x => x.startsWith('192.168.'));
        if (lanIp) {
            return lanIp;
        }
    }
    else if (list.length === 1) {
        return list[0];
    }
    return '0.0.0.0';
};
const getCpuInfo = () => {
    const cpus = os.cpus();
    return { count: cpus.length, speed: cpus[0].speed };
};
const getMemoryInfo = () => {
    return { free: os.freemem(), total: os.totalmem() };
};
class AppController {
    start() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getServerInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleInfo = BackendService_1.BackendService.instance.moduleRepository.get('reactron');
            const result = {
                hostname: os.hostname(),
                ip: getIPAddress(),
                cpu: getCpuInfo(),
                memory: getMemoryInfo(),
                version: moduleInfo && moduleInfo.version || ''
            };
            return result;
        });
    }
    exitApplication() {
        return __awaiter(this, void 0, void 0, function* () {
            BackendService_1.BackendService.instance.exit();
        });
    }
    restartApplication() {
        return __awaiter(this, void 0, void 0, function* () {
            BackendService_1.BackendService.instance.restart();
        });
    }
    shutdownSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            osCommand.shutdown();
            BackendService_1.BackendService.instance.exit();
        });
    }
    rebootSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            osCommand.reboot();
            BackendService_1.BackendService.instance.exit();
        });
    }
    resetApplication() {
        return __awaiter(this, void 0, void 0, function* () {
            BackendService_1.BackendService.instance.reset();
        });
    }
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BackendService_1.BackendService.instance.settings.get();
        });
    }
    setSettings(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            return BackendService_1.BackendService.instance.settings.set(settings);
        });
    }
}
exports.AppController = AppController;
//# sourceMappingURL=AppController.js.map