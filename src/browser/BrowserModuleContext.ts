import { IBackendService, IModuleContext, IPubSub } from "@schirkan/reactron-interfaces";

let electron: Electron.AllElectron;
let backendService: IBackendService;
let topics: IPubSub;
let Store: typeof ElectronStore;

if ((window as any).require) {
    electron = (window as any).require('electron');
    backendService = electron.remote.require('./dist/server/BackendService').BackendService.instance;
    topics = backendService.topics;
    Store = electron.remote.require('electron-store');
}

const moduleStoreCache: { [key: string]: ElectronStore } = {};
const serviceCache: { [key: string]: any } = {};

export class BrowserModuleContext implements IModuleContext {
    public readonly electron: Electron.AllElectron;
    public readonly backendService: IBackendService;
    public readonly topics: IPubSub;
    public readonly moduleStorage: ElectronStore;
    public readonly moduleApiPath: string;
    public readonly getService: <TService = any>(serviceName: string, moduleName?: string | undefined) => TService | undefined;

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

