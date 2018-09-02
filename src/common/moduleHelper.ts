import { BackendService } from '../server/BackendService';
import { PubSub } from '../server/PubSub';

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class ModuleHelper {
    public electron: Electron.AllElectron;
    public backendService: BackendService;
    public topics: PubSub;
    public storage: ElectronStore;

    constructor(public moduleName: string) {
        if (window) {
            this.electron = (window as any).require('electron');
            this.backendService = this.electron.remote.require('./dist/server/BackendService').BackendService.instance;
        } else {
            // tslint:disable-next-line:no-var-requires
            this.electron = require('electron');
            this.backendService = require('../server/BackendService').instance;
        }
        this.topics = this.backendService.topics;
        this.storage = new Store({ name: 'module.' + moduleName });
    }

    public getService(serviceName: string, moduleName?: string) {
        if (!moduleName) {
            moduleName = this.moduleName
        }
        return this.backendService.serviceManager.get(moduleName, serviceName);
    }
}