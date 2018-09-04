import { app } from 'electron';
import { IBackendServiceConfig } from '../interfaces/IBackendServiceConfig';
import { ISystemSettings } from '../interfaces/ISystemSettings';
import { ElectronApp } from './ElectronApp';
import { ExpressApp } from './ExpressApp';
import { ModuleManager } from './ModuleManager';
import { ModuleRepository } from './ModuleRepository';
import { OptionsRepository } from './OptionsRepository';
import { PubSub } from './PubSub';
import { ServiceManager } from './ServiceManager';
import { ServiceRepository } from './ServiceRepository';
import { SystemSettingsManager } from './SystemSettingsManager';

export class BackendService {
    public static instance: BackendService;

    public readonly moduleRepository = new ModuleRepository();
    public readonly serviceRepository = new ServiceRepository();
    public readonly optionsRepository = new OptionsRepository();
    public readonly electronApp = new ElectronApp(this.config);
    public readonly expressApp = new ExpressApp(this.config);
    public readonly serviceManager = new ServiceManager(this.serviceRepository, this.moduleRepository, this.optionsRepository);
    public readonly moduleManager = new ModuleManager(this.config, this.moduleRepository);
    public readonly topics = new PubSub();
    public readonly settings: ISystemSettings = new SystemSettingsManager();

    public constructor(public readonly config: IBackendServiceConfig) { }

    public async exit(): Promise<void> {
        this.electronApp.mainWindow.close();
        app.quit();
    }

    public async restart(): Promise<void> {
        app.relaunch();
        app.quit();
    }
}