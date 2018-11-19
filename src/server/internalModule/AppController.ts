import { IReactronService, IServerInfo } from '@schirkan/reactron-interfaces';
import * as os from 'os';
import { routes } from '../../common/apiRoutes';
import { ReactronServiceContext } from '../ReactronServiceContext';
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

export class AppController implements IReactronService {
    public async start(context: ReactronServiceContext): Promise<void> {
        console.log('AppController.start');

        registerRoute(context.moduleApiRouter, routes.getServerInfo, async (req, res) => {
            console.log('AppController.getServerInfo');

            const moduleInfo = context.backendService.moduleRepository.get('@schirkan/reactron');

            const result: IServerInfo = {
                hostname: os.hostname(),
                ip: getIPAddress(),
                cpu: getCpuInfo(),
                memory: getMemoryInfo(),
                version: moduleInfo && moduleInfo.version || ''
            };
            res.send(result);
        });

        registerRoute(context.moduleApiRouter, routes.exitApplication, async (req, res) => {
            console.log('AppController.exitApplication');
            res.sendStatus(204);
            context.backendService.exit();
        });

        registerRoute(context.moduleApiRouter, routes.restartApplication, async (req, res) => {
            console.log('AppController.restartApplication');
            res.sendStatus(204);
            context.backendService.restart();
        });

        registerRoute(context.moduleApiRouter, routes.shutdownSystem, async (req, res) => {
            console.log('AppController.shutdownSystem');
            res.sendStatus(204);
            osCommand.shutdown();
            context.backendService.exit();
        });

        registerRoute(context.moduleApiRouter, routes.rebootSystem, async (req, res) => {
            console.log('AppController.rebootSystem');
            res.sendStatus(204);
            osCommand.reboot();
            context.backendService.exit();
        });

        registerRoute(context.moduleApiRouter, routes.resetApplication, async (req, res) => {
            console.log('AppController.resetApplication');
            res.sendStatus(204);
            context.backendService.reset();
        });
    }
}