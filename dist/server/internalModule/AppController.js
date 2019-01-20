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
const os = require("os");
const apiRoutes_1 = require("../../common/apiRoutes");
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
    start(context) {
        return __awaiter(this, void 0, void 0, function* () {
            context.registerRoute(apiRoutes_1.routes.getServerInfo, (req, res) => {
                const moduleInfo = context.backendService.moduleRepository.get('reactron');
                const result = {
                    hostname: os.hostname(),
                    ip: getIPAddress(),
                    cpu: getCpuInfo(),
                    memory: getMemoryInfo(),
                    version: moduleInfo && moduleInfo.version || ''
                };
                res.send(result);
            });
            context.registerRoute(apiRoutes_1.routes.exitApplication, (req, res) => {
                res.sendStatus(204);
                context.backendService.exit();
            });
            context.registerRoute(apiRoutes_1.routes.restartApplication, (req, res) => {
                res.sendStatus(204);
                context.backendService.restart();
            });
            context.registerRoute(apiRoutes_1.routes.shutdownSystem, (req, res) => {
                res.sendStatus(204);
                osCommand.shutdown();
                context.backendService.exit();
            });
            context.registerRoute(apiRoutes_1.routes.rebootSystem, (req, res) => {
                res.sendStatus(204);
                osCommand.reboot();
                context.backendService.exit();
            });
            context.registerRoute(apiRoutes_1.routes.resetApplication, (req, res) => {
                res.sendStatus(204);
                context.backendService.reset();
            });
        });
    }
}
exports.AppController = AppController;
//# sourceMappingURL=AppController.js.map