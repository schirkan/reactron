import { IBackendService, IModuleContext, IPubSub, ISystemSettings, ElectronStore, topicNames } from "@schirkan/reactron-interfaces";
import { apiClient } from "./ApiClient";
import { createRemoteService } from "./RpcClient";

let electron: Electron.AllElectron;
let backendService: IBackendService;
let topics: IPubSub = { // TODO: mock
  clearAllSubscriptions: () => { },
  once: () => { },
  publish: () => { },
  subscribe: () => { },
  unsubscribe: () => { }
};
let Store: new (options?: any) => ElectronStore;

const moduleStoreCache: { [key: string]: ElectronStore } = {};
const serviceCache: { [key: string]: any } = {};
let settings: ISystemSettings;

export const initSettings = async () => {
  if (!settings) {
    settings = await apiClient.getSettings();
  }
}

export const initModuleContext = async () => {
  // check if env is electron
  if (!electron && (window as any).require) {
    electron = (window as any).require('electron');
    backendService = electron.remote.require('./dist/server/BackendService').BackendService.instance;
    topics = backendService.topics;
    Store = electron.remote.require('electron-store');

    // on settings change
    topics.subscribe(topicNames.systemSettingsUpdated, (event, data: ISystemSettings) => {
      settings = data;
    });
  }
}

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
    this.topics = topics;

    const moduleStoreKey = 'module.' + moduleName;
    if (Store && !moduleStoreCache[moduleStoreKey]) {
      moduleStoreCache[moduleStoreKey] = new Store({ name: 'module.' + moduleName });
    }
    this.moduleStorage = moduleStoreCache[moduleStoreKey];

    const escapedModuleName = moduleName.replace('/', '@');
    this.moduleApiPath = '/api/modules/' + escapedModuleName;

    this.getService = (serviceName: string, explicitModuleName?: string) => {
      return createRemoteService(serviceName, explicitModuleName || moduleName);

      // if (!this.backendService) {
      //   console.log('Method getService() is not supported in browser environment.');
      //   return undefined;
      // }
      // const serviceKey = (explicitModuleName || moduleName) + '.' + serviceName;
      // if (!serviceCache[serviceKey]) {
      //   serviceCache[serviceKey] = this.backendService.serviceManager.get(explicitModuleName || moduleName, serviceName);
      // }
      // return serviceCache[serviceKey] as TService | undefined;
    }
  }
}

