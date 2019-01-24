import { IServerInfo, IReactronServiceContext, IAppController, ISystemSettings } from '@schirkan/reactron-interfaces';
import * as os from 'os';
import { BackendService } from '../BackendService';

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

export class AppController implements IAppController {
  public async start(): Promise<void> { }

  public async getServerInfo(): Promise<IServerInfo> {
    const moduleInfo = BackendService.instance.moduleRepository.get('reactron');
    const result: IServerInfo = {
      hostname: os.hostname(),
      ip: getIPAddress(),
      cpu: getCpuInfo(),
      memory: getMemoryInfo(),
      version: moduleInfo && moduleInfo.version || ''
    };
    return result;
  }

  public async exitApplication(): Promise<void> {
    BackendService.instance.exit();
  }

  public async restartApplication(): Promise<void> {
    BackendService.instance.restart();
  }

  public async shutdownSystem(): Promise<void> {
    osCommand.shutdown();
    BackendService.instance.exit();
  }

  public async rebootSystem(): Promise<void> {
    osCommand.reboot();
    BackendService.instance.exit();
  }

  public async resetApplication(): Promise<void> {
    BackendService.instance.reset();
  }

  public async getSettings(): Promise<ISystemSettings> {
    return await BackendService.instance.settings.get();
  }

  public async setSettings(settings: ISystemSettings): Promise<void> {
    return BackendService.instance.settings.set(settings);
  }
}