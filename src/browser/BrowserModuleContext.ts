import { IBackendService, IModuleContext, IPubSub, ISystemSettings } from "@schirkan/reactron-interfaces";
import { apiClient } from "./ApiClient";

let electron: Electron.AllElectron;
let backendService: IBackendService;
let topics: IPubSub | undefined;
let Store: typeof ElectronStore;

// check if env is electron
if ((window as any).require) {
  electron = (window as any).require('electron');
  backendService = electron.remote.require('./dist/server/BackendService').BackendService.instance;
  topics = backendService.topics;
  Store = electron.remote.require('electron-store');
  
  // on settings change
  topics.subscribe('system-settings-updated', (event, data: ISystemSettings) => {
    settings = data
  });
}

const moduleStoreCache: { [key: string]: ElectronStore } = {};
const serviceCache: { [key: string]: any } = {};
let settings: ISystemSettings;

// load settings
apiClient.getSettings().then(x => settings = x); // TODO

export class BrowserModuleContext implements IModuleContext {
  public readonly electron: Electron.AllElectron;
  public readonly backendService: IBackendService;
  public readonly topics: IPubSub;
  public readonly moduleStorage: ElectronStore;
  public readonly moduleApiPath: string;
  public getService: <TService = any>(serviceName: string, moduleName?: string | undefined) => TService | undefined;
  public get settings(): Readonly<ISystemSettings> {
    return settings;
  }

  constructor(public moduleName: string) {
    this.electron = electron;
    this.backendService = backendService;
    this.topics = topics!;

    const moduleStoreKey = 'module.' + moduleName;
    if (Store && !moduleStoreCache[moduleStoreKey]) {
      moduleStoreCache[moduleStoreKey] = new Store({ name: 'module.' + moduleName });
    }
    this.moduleStorage = moduleStoreCache[moduleStoreKey];

    const escapedModuleName = moduleName.replace('/', '@');
    this.moduleApiPath = '/api/modules/' + escapedModuleName;

    this.getService = <TService>(serviceName: string, explicitModuleName?: string) => {
      if (!this.backendService) {
        console.log('Method getService() is not supported in browser environment.');
        return undefined;
      }
      const serviceKey = (explicitModuleName || moduleName) + '.' + serviceName;
      if (!serviceCache[serviceKey]) {
        serviceCache[serviceKey] = this.backendService.serviceManager.get(explicitModuleName || moduleName, serviceName);
      }
      return serviceCache[serviceKey] as TService | undefined;
    }
  }
}

