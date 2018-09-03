import { IModuleHelper } from "../interfaces/IModuleHelper";

// import { BackendService } from '../server/BackendService';
// import { PubSub } from '../server/PubSub';

export class BrowserModuleHelper implements IModuleHelper {
    public readonly electron: Electron.AllElectron;
    public readonly backendService: any; // TODO
    public readonly topics: any; // TODO
    public readonly moduleStorage: ElectronStore;
    public readonly moduleApiPath: string;

    constructor(public moduleName: string) {
        this.electron = (window as any).require('electron');
        this.backendService = this.electron.remote.require('./dist/server/BackendService').BackendService.instance;
        const Store = this.electron.remote.require('electron-store');

        this.moduleApiPath = '/api/modules/' + moduleName;
        this.topics = this.backendService.topics;
        this.moduleStorage = new Store({ name: 'module.' + moduleName });
    }

    public getService(serviceName: string, moduleName?: string) {
        return this.backendService.serviceManager.get(moduleName || this.moduleName, serviceName);
    }
}