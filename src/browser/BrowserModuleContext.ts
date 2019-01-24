import { IModuleContext, IPubSub, ISystemSettings, ElectronStore, topicNames, IPubSubEvent } from "@schirkan/reactron-interfaces";
import { createRemoteService } from "./RpcClient";
import { services } from "./ReactronServicesFrontend";

let electron: Electron.AllElectron;
let settings: ISystemSettings;
let topics: IPubSub = { // TODO: mock
  clearAllSubscriptions: () => { },
  once: () => { },
  publish: () => { },
  subscribe: () => { },
  unsubscribe: () => { }
};
let Store: new (options?: any) => ElectronStore;

export class BrowserModuleContext implements IModuleContext {
  public static inernalModuleContext: BrowserModuleContext;
  private static moduleStoreCache: { [key: string]: ElectronStore } = {};
  private static serviceCache: { [key: string]: any } = {};

  constructor(public moduleName: string) {
    const escapedModuleName = (moduleName || '').replace('/', '@');
    this.moduleApiPath = '/api/modules/' + escapedModuleName;
  }

  public readonly services = services;
  public readonly moduleApiPath: string;
  public get electron(): Electron.AllElectron { return electron };
  public get topics(): IPubSub { return topics; }
  public get settings(): Readonly<ISystemSettings> { return settings; }

  public get moduleStorage(): ElectronStore {
    const moduleStoreKey = 'module.' + this.moduleName;
    if (Store && !BrowserModuleContext.moduleStoreCache[moduleStoreKey]) {
      BrowserModuleContext.moduleStoreCache[moduleStoreKey] = new Store({ name: moduleStoreKey });
    }
    return BrowserModuleContext.moduleStoreCache[moduleStoreKey];
  }

  public async getService<TService = any>(serviceName: string, explicitModuleName?: string): Promise<TService | undefined> {
    const moduleName = explicitModuleName || this.moduleName;
    const serviceKey = serviceName + '.' + moduleName;
    if (!BrowserModuleContext.serviceCache[serviceKey]) {
      BrowserModuleContext.serviceCache[serviceKey] = createRemoteService<TService>(serviceName, moduleName);
    }
    return Promise.resolve(BrowserModuleContext.serviceCache[serviceKey]);
  }

  public static async init(): Promise<void> {
    // check if env is electron
    if (!electron && (window as any).require) {
      electron = (window as any).require('electron');
      const backendService = electron.remote.require('./dist/server/BackendService').BackendService.instance;
      topics = backendService.topics;
      Store = electron.remote.require('electron-store');

      // subscribe settings change
      topics.subscribe(topicNames.systemSettingsUpdated, (event: IPubSubEvent, data: ISystemSettings) => {
        settings = data;
      });
    }

    // init internal module
    BrowserModuleContext.inernalModuleContext = new BrowserModuleContext('reactron');

    // load settings
    if (!settings) {
      settings = await services.application.getSettings();
    }
  }
}