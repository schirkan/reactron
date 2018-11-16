import { IBackendService, IModuleContext, IPubSub } from "@schirkan/reactron-interfaces";

export class BrowserModuleContext implements IModuleContext {
    public readonly electron: Electron.AllElectron;
    public readonly backendService: IBackendService;
    public readonly topics: IPubSub;
    public readonly moduleStorage: ElectronStore;
    public readonly moduleApiPath: string;
    public readonly getService: <TService = any>(serviceName: string, moduleName?: string | undefined) => TService | undefined;

    constructor(public moduleName: string) {
        if ((window as any).require) {
            this.electron = (window as any).require('electron');
            this.backendService = this.electron.remote.require('./dist/server/BackendService').BackendService.instance;
            this.topics = this.backendService.topics;
            const Store = this.electron.remote.require('electron-store');
            this.moduleStorage = new Store({ name: 'module.' + moduleName });
        }

        const escapedModuleName = moduleName.replace('/', '@');
        this.moduleApiPath = '/api/modules/' + escapedModuleName;

        this.getService = <TService>(serviceName: string, explicitModuleName?: string) => {
            if (!this.backendService) {
                console.log('Method getService() is not supported in browser environment.');
                return undefined;
            }
            return this.backendService.serviceManager.get(explicitModuleName || moduleName, serviceName) as TService | undefined;
        }
    }
}

