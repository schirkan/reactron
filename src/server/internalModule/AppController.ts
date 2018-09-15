import * as os from 'os';
import { routes } from '../../common/apiRoutes';
import { IExternalService } from '../../interfaces/IExternalService';
import { IServerInfo } from '../../interfaces/IServerInfo';
import { ServerModuleHelper } from '../ServerModuleHelper';
import { registerRoute } from './registerRoute';

// tslint:disable-next-line:no-var-requires
const osCommand = require('electron-shutdown-command');

const getIPAddress = () => {
    const list: string[] = [];
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
    } else if (list.length === 1) {
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

export class AppController implements IExternalService {
    public async start(helper: ServerModuleHelper): Promise<void> {
        console.log('AppController.start');

        registerRoute(helper.moduleApiRouter, routes.getServerInfo, async (req, res) => {
            console.log('AppController.getServerInfo');

            const moduleInfo = helper.backendService.moduleRepository.get('reactron');

            const result: IServerInfo = {
                hostname: os.hostname(),
                ip: getIPAddress(),
                cpu: getCpuInfo(),
                memory: getMemoryInfo(),
                version: moduleInfo && moduleInfo.version || ''
            };
            res.send(result);
        });

        registerRoute(helper.moduleApiRouter, routes.exitApplication, async (req, res) => {
            console.log('AppController.exitApplication');
            res.sendStatus(204);
            helper.backendService.exit();
        });

        registerRoute(helper.moduleApiRouter, routes.restartApplication, async (req, res) => {
            console.log('AppController.restartApplication');
            res.sendStatus(204);
            helper.backendService.restart();
        });

        registerRoute(helper.moduleApiRouter, routes.shutdownSystem, async (req, res) => {
            console.log('AppController.shutdownSystem');
            res.sendStatus(204);
            osCommand.shutdown();
            helper.backendService.exit();
        });

        registerRoute(helper.moduleApiRouter, routes.rebootSystem, async (req, res) => {
            console.log('AppController.rebootSystem');
            res.sendStatus(204);
            osCommand.reboot();
            helper.backendService.exit();
        });

        registerRoute(helper.moduleApiRouter, routes.resetApplication, async (req, res) => {
            console.log('AppController.resetApplication');
            res.sendStatus(204);
            helper.backendService.reset();
        });
    }
}