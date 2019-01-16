import { IReactronService, IServerInfo } from '@schirkan/reactron-interfaces';
import * as os from 'os';
import { routes } from '../../common/apiRoutes';
import { ReactronServiceContext } from '../ReactronServiceContext';

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
    context.registerRoute(routes.getServerInfo, (req, res) => {
      const moduleInfo = context.backendService.moduleRepository.get('reactron');
      const result: IServerInfo = {
        hostname: os.hostname(),
        ip: getIPAddress(),
        cpu: getCpuInfo(),
        memory: getMemoryInfo(),
        version: moduleInfo && moduleInfo.version || ''
      };
      res.send(result);
    });

    context.registerRoute(routes.exitApplication, (req, res) => {
      res.sendStatus(204);
      context.backendService.exit();
    });

    context.registerRoute(routes.restartApplication, (req, res) => {
      res.sendStatus(204);
      context.backendService.restart();
    });

    context.registerRoute(routes.shutdownSystem, (req, res) => {
      res.sendStatus(204);
      osCommand.shutdown();
      context.backendService.exit();
    });

    context.registerRoute(routes.rebootSystem, (req, res) => {
      res.sendStatus(204);
      osCommand.reboot();
      context.backendService.exit();
    });

    context.registerRoute(routes.resetApplication, (req, res) => {
      res.sendStatus(204);
      context.backendService.reset();
    });
  }
}